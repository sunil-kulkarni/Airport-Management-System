from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db, engine
import models
import schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airport Management System API")

# CORS - MUST BE IMMEDIATELY AFTER app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/signin")
def signin(
    first_name: str = Body(..., embed=True),
    password: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    try:
        # Query for Airport Head of Staff with matching first name and password
        employee = db.query(models.Employee).filter(
            models.Employee.F_Name == first_name,
            models.Employee.pwd == password,
            models.Employee.Job_title == "Airport Head of Staff"
        ).first()

        if not employee:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Return relevant employee info
        return {
            "Employee_ID": employee.Employee_ID,
            "Employee_name": employee.Employee_name,
            "Job_title": employee.Job_title,
            "Airport_ID": employee.Airport_ID,
            # Compute age or other fields if needed here
        }
    except Exception as e:
        print(f"Error in signin: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
# ==================== Reports ====================
# ==================== REPORTS ROUTES ====================

@app.get("/api/reports/flight-traffic")
def get_flight_traffic_report(db: Session = Depends(get_db)):
    try:
        flights = db.query(models.Flight).all()
        
        # Flight status breakdown
        arrivals = len([f for f in flights if f.Flight_status == 'Arrival'])
        departures = len([f for f in flights if f.Flight_status == 'Departure'])
        
        # Airline breakdown
        airline_stats = {}
        for flight in flights:
            if flight.Airline_name not in airline_stats:
                airline_stats[flight.Airline_name] = 0
            airline_stats[flight.Airline_name] += 1
        
        # Route breakdown
        routes = {}
        for flight in flights:
            route = f"{flight.src_city} → {flight.des_city}"
            if route not in routes:
                routes[route] = 0
            routes[route] += 1
        
        return {
            "total_flights": len(flights),
            "arrivals": arrivals,
            "departures": departures,
            "airline_breakdown": airline_stats,
            "top_routes": dict(sorted(routes.items(), key=lambda x: x[1], reverse=True)[:10])
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/reports/employee-stats")
def get_employee_report(db: Session = Depends(get_db)):
    try:
        employees = db.query(models.Employee).all()
        
        # Job title breakdown
        job_stats = {}
        total_salary = 0
        
        for emp in employees:
            if emp.Job_title not in job_stats:
                job_stats[emp.Job_title] = {"count": 0, "total_salary": 0}
            job_stats[emp.Job_title]["count"] += 1
            job_stats[emp.Job_title]["total_salary"] += emp.Employee_Salary
            total_salary += emp.Employee_Salary
        
        return {
            "total_employees": len(employees),
            "total_salary_expense": total_salary,
            "average_salary": total_salary // len(employees) if len(employees) > 0 else 0,
            "job_breakdown": job_stats
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/reports/passenger-traffic")
def get_passenger_traffic_report(db: Session = Depends(get_db)):
    try:
        passengers = db.query(models.Passenger).all()
        tickets = db.query(models.Ticket).all()
        baggage = db.query(models.Baggage).all()
        
        # Passenger stats
        total_passengers = len(passengers)
        total_tickets = len(tickets)
        total_baggage = len(baggage)
        
        # Ticket class breakdown
        class_stats = {}
        for ticket in tickets:
            if ticket.Class not in class_stats:
                class_stats[ticket.Class] = 0
            class_stats[ticket.Class] += 1
        
        # Baggage weight stats
        total_weight = sum(b.Baggage_weight for b in baggage if b.Baggage_weight)
        avg_weight = total_weight / len(baggage) if len(baggage) > 0 else 0
        
        return {
            "total_passengers": total_passengers,
            "total_tickets": total_tickets,
            "total_baggage": total_baggage,
            "ticket_class_breakdown": class_stats,
            "baggage_stats": {
                "total_weight": total_weight,
                "average_weight": round(avg_weight, 2)
            }
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



# ==================== Flight Schedule Route ====================
@app.get("/api/flight-schedule")
def get_flight_schedule(db: Session = Depends(get_db)):
    try:
        flights = db.query(models.Flight).all()
        
        flight_list = []
        for f in flights:
            flight_list.append({
                "Flight_no": f.Flight_no,
                "Airline_name": f.Airline_name,
                "Flight_status": f.Flight_status,
                "arrival_time": str(f.arrival_time) if f.arrival_time else None,
                "Airport_ID": f.Airport_ID,
                "Airline_ID": f.Airline_ID,
                "Gate_no": f.Gate_no,
                "Terminal": f.Terminal,
                "src_city": f.src_city,
                "des_city": f.des_city
            })
        
        return {"flights": flight_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ADD this after your existing flight-schedule GET route

@app.post("/api/flight-schedule/add")
def add_flight(flight_data: dict, db: Session = Depends(get_db)):
    try:
        new_flight = models.Flight(
            Flight_no=flight_data['Flight_no'],
            Airline_name=flight_data['Airline_name'],
            Flight_status=flight_data['Flight_status'],
            arrival_time=flight_data['arrival_time'],
            Airport_ID=flight_data['Airport_ID'],
            Airline_ID=int(flight_data['Airline_ID']),
            Gate_no=flight_data['Gate_no'],
            Terminal=int(flight_data['Terminal']) if flight_data['Terminal'] else None,
            src_city=flight_data['src_city'],
            des_city=flight_data['des_city']
        )
        
        db.add(new_flight)
        db.commit()
        db.refresh(new_flight)
        
        return {"message": "Flight added successfully", "flight_no": new_flight.Flight_no}
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/flight-schedule/delete/{flight_no}")
def delete_flight(flight_no: str, db: Session = Depends(get_db)):
    try:
        flight = db.query(models.Flight).filter(models.Flight.Flight_no == flight_no).first()
        
        if not flight:
            raise HTTPException(status_code=404, detail="Flight not found")
        
        db.delete(flight)
        db.commit()
        
        return {"message": "Flight deleted successfully", "flight_no": flight_no}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Airport Administration Route ====================

# Add these routes to your main.py after your flight-schedule routes

# ==================== EMPLOYEE ROUTES ====================

@app.get("/api/employees")
def get_employees(db: Session = Depends(get_db)):
    try:
        employees = db.query(models.Employee).all()
        
        employee_list = []
        for emp in employees:
            employee_list.append({
                'Employee_ID': emp.Employee_ID,
                'F_Name': emp.F_Name,
                'M_Initial': emp.M_Initial,
                'L_Name': emp.L_Name,
                'Employee_name': emp.Employee_name,
                'Hire_date': emp.Hire_date.isoformat() if emp.Hire_date else None,
                'Employee_Salary': emp.Employee_Salary,
                'Job_title': emp.Job_title,
                'Airport_ID': emp.Airport_ID,
                'pwd': emp.pwd
            })
        
        return {"employees": employee_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/employees/add")
def add_employee(employee_data: dict, db: Session = Depends(get_db)):
    try:
        new_employee = models.Employee(
            Employee_ID=int(employee_data['Employee_ID']),
            F_Name=employee_data['F_Name'],
            M_Initial=employee_data.get('M_Initial'),
            L_Name=employee_data['L_Name'],
            Employee_name=employee_data['Employee_name'],
            Hire_date=employee_data['Hire_date'],
            Employee_Salary=int(employee_data['Employee_Salary']),
            Job_title=employee_data['Job_title'],
            Airport_ID=employee_data['Airport_ID'],
            pwd=employee_data.get('pwd')
        )
        
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        
        return {"message": "Employee added successfully", "employee_id": new_employee.Employee_ID}
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/employees/delete/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        employee = db.query(models.Employee).filter(models.Employee.Employee_ID == employee_id).first()
        
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        db.delete(employee)
        db.commit()
        
        return {"message": "Employee deleted successfully", "employee_id": employee_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Crew Info Route ====================
# ==================== CREW ROUTES ====================

@app.get("/api/crew")
def get_crew(db: Session = Depends(get_db)):
    try:
        crew_members = db.query(
            models.Crew,
            models.Employee.Employee_name,
            models.Flight.src_city,
            models.Flight.des_city
        ).join(
            models.Employee, models.Crew.Employee_ID == models.Employee.Employee_ID
        ).join(
            models.Flight, models.Crew.Flight_no == models.Flight.Flight_no
        ).all()
        
        crew_list = []
        for crew, emp_name, src, des in crew_members:
            crew_list.append({
                'Crew_ID': crew.Crew_ID,
                'Crew_role': crew.Crew_role,
                'Employee_ID': crew.Employee_ID,
                'Employee_name': emp_name,
                'Flight_no': crew.Flight_no,
                'src_city': src,
                'des_city': des
            })
        
        return {"crew": crew_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/flights-list")
def get_flights_list(db: Session = Depends(get_db)):
    try:
        flights = db.query(models.Flight.Flight_no, models.Flight.src_city, models.Flight.des_city).all()
        
        flight_list = [
            {
                'Flight_no': f.Flight_no,
                'src_city': f.src_city,
                'des_city': f.des_city
            } for f in flights
        ]
        
        return {"flights": flight_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/crew-employees")
def get_crew_employees(db: Session = Depends(get_db)):
    try:
        employees = db.query(models.Employee).filter(
            (models.Employee.Job_title == 'Pilot') | 
            (models.Employee.Job_title == 'Flight Attendant')
        ).all()
        
        employee_list = []
        for emp in employees:
            employee_list.append({
                'Employee_ID': emp.Employee_ID,
                'Employee_name': emp.Employee_name,
                'Job_title': emp.Job_title
            })
        
        return {"employees": employee_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/crew/add")
def add_crew(crew_data: dict, db: Session = Depends(get_db)):
    try:
        new_crew = models.Crew(
            Crew_ID=int(crew_data['Crew_ID']),
            Crew_role=crew_data['Crew_role'],
            Employee_ID=int(crew_data['Employee_ID']),
            Flight_no=crew_data['Flight_no']
        )
        
        db.add(new_crew)
        db.commit()
        db.refresh(new_crew)
        
        return {"message": "Crew member added successfully", "crew_id": new_crew.Crew_ID}
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/crew/delete/{crew_id}")
def delete_crew(crew_id: int, db: Session = Depends(get_db)):
    try:
        crew = db.query(models.Crew).filter(models.Crew.Crew_ID == crew_id).first()
        
        if not crew:
            raise HTTPException(status_code=404, detail="Crew member not found")
        
        db.delete(crew)
        db.commit()
        
        return {"message": "Crew member deleted successfully", "crew_id": crew_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Passenger Info Route ====================
@app.get("/api/passenger-info/data")
def get_passenger_info_data(db: Session = Depends(get_db)):
    try:
        passengers = db.query(models.Passenger).all()
        baggage = db.query(models.Baggage).all()
        tickets = db.query(models.Ticket).all()
        
        passenger_list = []
        for p in passengers:
            passenger_list.append({
                "Passenger_ID": p.Passenger_ID,
                "F_Name": p.F_Name,
                "M_Name": p.M_Name,
                "L_Name": p.L_Name,
                "Passenger_name": p.Passenger_name,
                "DOB": str(p.DOB) if p.DOB else None,
                "passport_no": p.passport_no,
                "Passenger_Address": p.Passenger_Address,
                "Flight_no": p.Flight_no
            })
        
        baggage_list = []
        for b in baggage:
            baggage_list.append({
                "Baggage_ID": b.Baggage_ID,
                "Baggae_weight": float(b.Baggae_weight) if b.Baggae_weight else None,
                "Baggage_status": b.Baggage_status,
                "Passenger_ID": b.Passenger_ID,
                "Flight_no": b.Flight_no
            })
        
        ticket_list = []
        for t in tickets:
            ticket_list.append({
                "Ticket_no": t.Ticket_no,
                "Price": float(t.Price) if t.Price else None,
                "Seat_No": t.Seat_No,
                "Booking_date": str(t.Booking_date) if t.Booking_date else None,
                "Flight_no": t.Flight_no,
                "Passenger_ID": t.Passenger_ID
            })
        
        return {"passengers": passenger_list, "baggage": baggage_list, "tickets": ticket_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Emergency Ground Route ====================
@app.get("/api/emergency-ground/data")
def get_emergency_ground_data(db: Session = Depends(get_db)):
    try:
        employees = db.query(models.Employee).all()
        aircraft = db.query(models.Aircraft).all()
        
        employee_list = []
        for e in employees:
            employee_list.append({
                "Employee_ID": e.Employee_ID,
                "F_Name": e.F_Name,
                "L_Name": e.L_Name,
                "Job_title": e.Job_title,
                "Airport_ID": e.Airport_ID
            })
        
        aircraft_list = []
        for a in aircraft:
            aircraft_list.append({
                "Aircraft_ID": a.Aircraft_ID,
                "capacity": a.capacity,
                "Manufacturer": a.Manufacturer,
                "Model": a.Model,
                "Airline_ID": a.Airline_ID
            })
        
        return {"employees": employee_list, "aircraft": aircraft_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
