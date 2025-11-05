from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db, engine
from pydantic import BaseModel

app = FastAPI(title="Airport Management System API")

class StatusUpdate(BaseModel):
    status: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
        query = text("""
            SELECT * FROM Employee 
            WHERE F_Name = :first_name 
              AND pwd = :password 
              AND Job_title = 'Airport Head of Staff' LIMIT 1
        """)
        res = db.execute(query, {"first_name": first_name, "password": password})
        employee = res.fetchone()
        if not employee:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "Employee_ID": employee.Employee_ID,
            "Employee_name": employee.Employee_name,
            "Job_title": employee.Job_title,
            "Airport_ID": employee.Airport_ID,
        }
    except Exception as e:
        print(f"Error in signin: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/reports/flight-traffic")
def get_flight_traffic_report(db: Session = Depends(get_db)):
    try:
        flights = db.execute(text("SELECT * FROM Flight")).fetchall()
        arrivals = sum(1 for f in flights if f.Flight_status == 'Arrival')
        departures = sum(1 for f in flights if f.Flight_status == 'Departure')

        airline_stats = {}
        routes = {}

        for flight in flights:
            airline_stats[flight.Airline_name] = airline_stats.get(flight.Airline_name, 0) + 1
            route = f"{flight.src_city} → {flight.des_city}"
            routes[route] = routes.get(route, 0) + 1

        top_routes = dict(sorted(routes.items(), key=lambda x: x[1], reverse=True)[:10])

        return {
            "total_flights": len(flights),
            "arrivals": arrivals,
            "departures": departures,
            "airline_breakdown": airline_stats,
            "top_routes": top_routes
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/employee-stats")
def get_employee_report(db: Session = Depends(get_db)):
    try:
        # Call the stored procedure
        results = db.execute(text("CALL GetEmployeeStats()")).fetchall()

        job_stats = {row.Job_title: {"count": row.emp_count, "total_salary": row.total_salary} for row in results}
        total_employees = sum(row.emp_count for row in results)
        total_salary = sum(row.total_salary for row in results)

        avg_salary_row = db.execute(text("SELECT GetAverageSalary() AS avg_salary")).fetchone()
        avg_salary = avg_salary_row.avg_salary if avg_salary_row else 0

        return {
            "total_employees": total_employees,
            "total_salary_expense": total_salary,
            "average_salary": avg_salary,
            "job_breakdown": job_stats
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/api/reports/passenger-traffic")
def get_passenger_traffic_report(db: Session = Depends(get_db)):
    try:
        passengers = db.execute(text("SELECT * FROM Passenger")).fetchall()
        tickets = db.execute(text("SELECT * FROM Ticket")).fetchall()
        baggage = db.execute(text("SELECT * FROM Baggage")).fetchall()

        total_passengers = len(passengers)
        total_tickets = len(tickets)
        total_baggage = len(baggage)

        class_stats = {}
        for ticket in tickets:
            cls = ticket.Class
            class_stats[cls] = class_stats.get(cls, 0) + 1

        total_weight = sum(b.Baggage_weight for b in baggage if b.Baggage_weight)
        avg_weight = total_weight / total_baggage if total_baggage > 0 else 0

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

@app.get("/api/flight-schedule")
def get_flight_schedule(db: Session = Depends(get_db)):
    try:
        flights = db.execute(text("SELECT * FROM Flight")).fetchall()
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

@app.post("/api/flight-schedule/add")
def add_flight(flight_data: dict, db: Session = Depends(get_db)):
    try:
        insert_query = text("""
            INSERT INTO Flight (Flight_no, Airline_name, Flight_status, arrival_time, Airport_ID, Airline_ID, Gate_no, Terminal, src_city, des_city)
            VALUES (:Flight_no, :Airline_name, :Flight_status, :arrival_time, :Airport_ID, :Airline_ID, :Gate_no, :Terminal, :src_city, :des_city)
        """)
        db.execute(insert_query, flight_data)
        db.commit()
        return {"message": "Flight added successfully", "flight_no": flight_data['Flight_no']}
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/flight-schedule/delete/{flight_no}")
def delete_flight(flight_no: str, db: Session = Depends(get_db)):
    try:
        delete_query = text("DELETE FROM Flight WHERE Flight_no = :flight_no")
        result = db.execute(delete_query, {"flight_no": flight_no})
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Flight not found")
        db.commit()
        return {"message": "Flight deleted successfully", "flight_no": flight_no}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/employees")
def get_employees(db: Session = Depends(get_db)):
    try:
        employees = db.execute(text("SELECT * FROM Employee")).fetchall()
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
        insert_query = text("""
            INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd)
            VALUES (:Employee_ID, :F_Name, :M_Initial, :L_Name, :Employee_name, :Hire_date, :Employee_Salary, :Job_title, :Airport_ID, :pwd)
        """)
        db.execute(insert_query, employee_data)
        db.commit()
        return {"message": "Employee added successfully", "employee_id": employee_data['Employee_ID']}
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/employees/delete/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        delete_query = text("DELETE FROM Employee WHERE Employee_ID = :id")
        result = db.execute(delete_query, {"id": employee_id})
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Employee not found")
        db.commit()
        return {"message": "Employee deleted successfully", "employee_id": employee_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/employees/average-salary")
def get_average_salary(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT GetAverageSalary() AS average_salary")).fetchone()
        avg_salary = result.average_salary if result else 0
        return {"average_salary": avg_salary}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/crew")
def get_crew(db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT c.Crew_ID, c.Crew_role, c.Employee_ID, e.Employee_name, c.Flight_no, f.src_city, f.des_city
            FROM Crew c
            JOIN Employee e ON c.Employee_ID = e.Employee_ID
            JOIN Flight f ON c.Flight_no = f.Flight_no
        """)
        crew_members = db.execute(query).fetchall()
        crew_list = []
        for c in crew_members:
            crew_list.append({
                'Crew_ID': c.Crew_ID,
                'Crew_role': c.Crew_role,
                'Employee_ID': c.Employee_ID,
                'Employee_name': c.Employee_name,
                'Flight_no': c.Flight_no,
                'src_city': c.src_city,
                'des_city': c.des_city
            })
        return {"crew": crew_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/flights-list")
def get_flights_list(db: Session = Depends(get_db)):
    try:
        flights = db.execute(text("SELECT Flight_no, src_city, des_city FROM Flight")).fetchall()
        flight_list = []
        for f in flights:
            flight_list.append({
                'Flight_no': f.Flight_no,
                'src_city': f.src_city,
                'des_city': f.des_city
            })
        return {"flights": flight_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/crew-employees")
def get_crew_employees(db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT Employee_ID, Employee_name, Job_title FROM Employee
            WHERE Job_title IN ('Pilot', 'Flight Attendant')
        """)
        employees = db.execute(query).fetchall()
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

@app.put("/api/crew/assign")
def assign_crew_to_flight(assignment_data: dict, db: Session = Depends(get_db)):
    try:
        crew_id = assignment_data.get("Crew_ID")
        flight_no = assignment_data.get("Flight_no")
        
    
        if not crew_id or not flight_no:
            raise HTTPException(status_code=400, detail="Crew_ID and Flight_no are required")
            
        # Update Crew's Flight_no WHERE Crew_ID matches and current Flight_no IS NULL
        update_query = text("""
            UPDATE Crew 
            SET Flight_no = :flight_no 
            WHERE Crew_ID = :crew_id AND Flight_no IS NULL
        """)
        result = db.execute(update_query, {"crew_id": crew_id, "flight_no": flight_no})
        if result.rowcount == 0:
            # No rows updated = either Crew_ID not found or already assigned to a flight
            raise HTTPException(status_code=404, detail="Crew member not found or already assigned")
        db.commit()
        return {"message": "Crew member assigned successfully", "crew_id": crew_id, "flight_no": flight_no}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/crew/delete/{crew_id}")
def delete_crew(crew_id: int, db: Session = Depends(get_db)):
    try:
        delete_query = text("DELETE FROM Crew WHERE Crew_ID = :id")
        result = db.execute(delete_query, {"id": crew_id})
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Crew member not found")
        db.commit()
        return {"message": "Crew member deleted successfully", "crew_id": crew_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/flights")
def get_flights(db: Session = Depends(get_db)):
    try:
        flights = db.execute(text("SELECT DISTINCT Flight_no FROM Flight")).fetchall()
        return {"flights": [f[0] for f in flights]}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/flight/{flight_no}/passengers")
def get_passengers_for_flight(flight_no: str, db: Session = Depends(get_db)):
    try:
        passengers = db.execute(text("SELECT * FROM Passenger WHERE Flight_no = :flight_no"), {"flight_no": flight_no}).fetchall()

        passenger_list = []
        for p in passengers:
            baggage = db.execute(text("SELECT * FROM Baggage WHERE Passenger_ID = :pid"), {"pid": p.Passenger_ID}).first()
            ticket = db.execute(text("SELECT * FROM Ticket WHERE Passenger_ID = :pid"), {"pid": p.Passenger_ID}).first()
            passenger_list.append({
                "Passenger_ID": p.Passenger_ID,
                "Passenger_name": p.Passenger_name,
                "Passenger_status": p.Passenger_status or "Normal",
                "baggage_weight": baggage.Baggae_weight if baggage else None,
                "baggage_id": baggage.Baggage_ID if baggage else None,
                "ticket_id": ticket.Ticket_no if ticket else None,
            })

        normal = [p for p in passenger_list if p['Passenger_status'].lower() == "normal"]
        flagged = [p for p in passenger_list if p['Passenger_status'].lower() != "normal"]

        return {"passengers": normal + flagged}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/passenger/{passenger_id}")
def delete_passenger(passenger_id: int, db: Session = Depends(get_db)):
    try:
        delete_query = text("DELETE FROM Passenger WHERE Passenger_ID = :id")
        result = db.execute(delete_query, {"id": passenger_id})
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Passenger not found")
        db.commit()
        return {"message": "Deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/passenger/{passenger_id}/status")
def update_passenger_status(passenger_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    try:
        update_query = text("UPDATE Passenger SET Passenger_status = :status WHERE Passenger_ID = :id")
        result = db.execute(update_query, {"status": status_update.status, "id": passenger_id})
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Passenger not found")
        db.commit()
        return {"message": "Updated"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ground_operations/data")
def get_ground_operations_data(db: Session = Depends(get_db)):
    try:
        # Get medical staff
        medical_staff = db.execute(text("""
            SELECT Employee_ID, Employee_name, Job_title 
            FROM Employee 
            WHERE Job_title IN ('Medical staff', 'Medical staffs')
        """)).fetchall()

        # Get ground engineers
        ground_engineers = db.execute(text("""
            SELECT Employee_ID, Employee_name, Job_title 
            FROM Employee 
            WHERE Job_title = 'Ground Engineer'
        """)).fetchall()

        # Get flagged passengers with illness
        ill_passengers = db.execute(text("""
            SELECT p.Passenger_ID, p.Passenger_name, p.Passenger_status, p.Flight_no, f.src_city, f.des_city
            FROM Passenger p
            JOIN Flight f ON p.Flight_no = f.Flight_no
            WHERE p.Passenger_status = 'Illness'
        """)).fetchall()

        # Get arrival flights
        arrival_flights = db.execute(text("""
            SELECT Flight_no, src_city, des_city, Airline_name, arrival_time
            FROM Flight
            WHERE Flight_status = 'Arrival'
        """)).fetchall()

        return {
            "medical_staff": [{"Employee_ID": m.Employee_ID, "Employee_name": m.Employee_name, "Job_title": m.Job_title} for m in medical_staff],
            "ground_engineers": [{"Employee_ID": g.Employee_ID, "Employee_name": g.Employee_name, "Job_title": g.Job_title} for g in ground_engineers],
            "ill_passengers": [{"Passenger_ID": p.Passenger_ID, "Passenger_name": p.Passenger_name, "Passenger_status": p.Passenger_status, "Flight_no": p.Flight_no, "src_city": p.src_city, "des_city": p.des_city} for p in ill_passengers],
            "arrival_flights": [{"Flight_no": f.Flight_no, "src_city": f.src_city, "des_city": f.des_city, "Airline_name": f.Airline_name, "arrival_time": str(f.arrival_time) if f.arrival_time else None} for f in arrival_flights]
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ground_operations/assign_medical")
def assign_medical_staff(data: dict, db: Session = Depends(get_db)):
    try:
        passenger_id = data.get("Passenger_ID")
        staff_id = data.get("Employee_ID")

        if not passenger_id or not staff_id:
            raise HTTPException(status_code=400, detail="Passenger_ID and Employee_ID are required")

        # Here you can create assignment logic - could be stored in a new table or update passenger records
        # For now, we'll just return success
        return {"message": "Medical staff assigned successfully", "passenger_id": passenger_id, "staff_id": staff_id}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ground_operations/assign_engineer")
def assign_ground_engineer(data: dict, db: Session = Depends(get_db)):
    try:
        flight_no = data.get("Flight_no")
        engineer_id = data.get("Employee_ID")

        if not flight_no or not engineer_id:
            raise HTTPException(status_code=400, detail="Flight_no and Employee_ID are required")

        return {"message": "Ground engineer assigned successfully", "flight_no": flight_no, "engineer_id": engineer_id}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
