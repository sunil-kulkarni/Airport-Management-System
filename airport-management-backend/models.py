from sqlalchemy import Column, Integer, String, Date, Time, DECIMAL, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# 1. Airline Table
class Airline(Base):
    __tablename__ = "Airline"
    
    Airline_ID = Column(Integer, primary_key=True)
    Airline_name = Column(String(255), nullable=False)
    Headquarters_location = Column(String(255))


# 2. Airport Table
class Airport(Base):
    __tablename__ = "Airport"
    
    Airport_ID = Column(String(3), primary_key=True)
    Airport_location = Column(String(255))
    IATA_code = Column(String(3), unique=True, nullable=False)
    Airport_name = Column(String(50))
    Airport_timezone = Column(String(100))


# 3. Aircraft Table
class Aircraft(Base):
    __tablename__ = "Aircraft"
    
    Aircraft_ID = Column(String(50), primary_key=True)
    capacity = Column(Integer)
    Manufacturer = Column(String(255))
    Model = Column(String(255))
    Airline_ID = Column(Integer, ForeignKey('Airline.Airline_ID'), nullable=False)


# 4. Employee Table
class Employee(Base):
    __tablename__ = "Employee"
    
    Employee_ID = Column(Integer, primary_key=True)
    F_Name = Column(String(100), nullable=False)
    M_Initial = Column(String(1))
    L_Name = Column(String(100), nullable=False)
    Employee_name = Column(String(200))
    Hire_date = Column(Date)
    Employee_Salary = Column(Integer)
    Job_title = Column(String(100))
    Airport_ID = Column(String(3), ForeignKey('Airport.Airport_ID'), nullable=False)
    pwd = Column(String(255))  # Store hashed password


# 5. Flight Table
class Flight(Base):
    __tablename__ = "Flight"
    
    Flight_no = Column(String(20), primary_key=True)
    Airline_name = Column(String(255))
    Flight_status = Column(String(20))
    arrival_time = Column(Time)
    Airport_ID = Column(String(3), ForeignKey('Airport.Airport_ID'), nullable=False)  # Changed
    Airline_ID = Column(Integer, ForeignKey('Airline.Airline_ID'), nullable=False)
    Gate_no = Column(String(10))
    Terminal = Column(Integer)
    src_city = Column(String(255)) 
    des_city = Column(String(255))  



# 6. Passenger Table
class Passenger(Base):
    __tablename__ = "Passenger"
    Passenger_ID = Column(Integer, primary_key=True)
    F_Name = Column(String(100), nullable=False)
    M_Name = Column(String(100))
    L_Name = Column(String(100), nullable=False)
    Passenger_name = Column(String(200))
    DOB = Column(Date)
    Passenger_Address = Column(String(255))
    Flight_no = Column(String(20), ForeignKey('Flight.Flight_no'), nullable=False)
    Passenger_status = Column(String(20))


# 7. Gate Table
class Gate(Base):
    __tablename__ = "Gate"
    
    Gate_no = Column(String(10), primary_key=True)
    Airport_ID = Column(String(3), ForeignKey('Airport.Airport_ID'), primary_key=True)
    Terminal = Column(Integer)


# 8. Crew Table
class Crew(Base):
    __tablename__ = "Crew"
    
    Crew_ID = Column(Integer, primary_key=True)
    Employee_ID = Column(Integer, ForeignKey('Employee.Employee_ID'), primary_key=True, unique=True)
    Flight_no = Column(String(20), ForeignKey('Flight.Flight_no'), primary_key=True)
    Crew_role = Column(String(100))


# 9. Baggage Table
class Baggage(Base):
    __tablename__ = "Baggage"
    
    Baggage_ID = Column(Integer, primary_key=True)
    Passenger_ID = Column(Integer, ForeignKey('Passenger.Passenger_ID'), primary_key=True)
    Flight_no = Column(String(20), ForeignKey('Flight.Flight_no'), primary_key=True)
    Baggae_weight = Column(DECIMAL(10, 2))
    Baggage_status = Column(String(50))


# 10. Ticket Table
class Ticket(Base):
    __tablename__ = "Ticket"
    
    Ticket_no = Column(String(50), primary_key=True)
    Flight_no = Column(String(20), ForeignKey('Flight.Flight_no'), primary_key=True)
    Passenger_ID = Column(Integer, ForeignKey('Passenger.Passenger_ID'), primary_key=True)
    Price = Column(DECIMAL(10, 2))
    Seat_No = Column(String(10))
    Booking_date = Column(Date)


# 11. FE_ASSIGNED Table
class FE_ASSIGNED(Base):
    __tablename__ = "FE_ASSIGNED"
    
    Employee_ID = Column(Integer, ForeignKey('Employee.Employee_ID'), primary_key=True)
    Flight_no = Column(String(20), ForeignKey('Flight.Flight_no'), primary_key=True)


# 12. Boards Table
class Boards(Base):
    __tablename__ = "Boards"
    
    Passenger_ID = Column(Integer, ForeignKey('Passenger.Passenger_ID'), primary_key=True)
    Flight_no = Column(String(20), ForeignKey('Flight.Flight_no'), primary_key=True)


# 13. Passenger_Email Table
class Passenger_Email(Base):
    __tablename__ = "Passenger_Email"
    
    Passenger_ID = Column(Integer, ForeignKey('Passenger.Passenger_ID'), primary_key=True)
    Passenger_email = Column(String(50), primary_key=True)


# 14. Passenger_phone Table
class Passenger_phone(Base):
    __tablename__ = "Passenger_phone"
    
    Passenger_ID = Column(Integer, ForeignKey('Passenger.Passenger_ID'), primary_key=True)
    Passenger_phone = Column(BigInteger, primary_key=True)
