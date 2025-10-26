from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class AirlineSchema(BaseModel):
    Airline_ID: int
    Airline_name: str
    Headquarters_location: Optional[str] = None
    
    class Config:
        from_attributes = True

class AirportSchema(BaseModel):
    Airport_ID: str
    Airport_location: Optional[str] = None
    IATA_code: str
    Airport_name: Optional[str] = None
    Airport_timezone: Optional[str] = None
    
    class Config:
        from_attributes = True

class AircraftSchema(BaseModel):
    Aircraft_ID: str
    capacity: Optional[int] = None
    Manufacturer: Optional[str] = None
    Model: Optional[str] = None
    Airline_ID: int
    
    class Config:
        from_attributes = True

class EmployeeSchema(BaseModel):
    Employee_ID: int
    F_Name: str
    M_Initial: Optional[str] = None
    L_Name: str
    Employee_name: Optional[str] = None
    Hire_date: Optional[date] = None
    Employee_Salary: Optional[int] = None
    Job_title: Optional[str] = None
    Airport_ID: str
    pwd: Optional[str] = None
    
    class Config:
        from_attributes = True

class FlightSchema(BaseModel):
    Flight_no: str
    Airline_name: Optional[str] = None
    Flight_status: Optional[str] = None
    arrival_time: Optional[time] = None
    Airport_ID: str
    Airline_ID: int
    Gate_no: Optional[str] = None
    Terminal: Optional[int] = None
    src_city: Optional[str] = None
    des_city: Optional[str] = None
    
    class Config:
        from_attributes = True

class PassengerSchema(BaseModel):
    Passenger_ID: int
    F_Name: str
    M_Name: Optional[str] = None
    L_Name: str
    Passenger_name: Optional[str] = None
    DOB: Optional[date] = None
    passport_no: Optional[str] = None
    Passenger_Address: Optional[str] = None
    Flight_no: str
    
    class Config:
        from_attributes = True

class GateSchema(BaseModel):
    Gate_no: str
    Airport_ID: str
    Terminal: Optional[int] = None
    
    class Config:
        from_attributes = True

class CrewSchema(BaseModel):
    Crew_ID: int
    Crew_role: Optional[str] = None
    Employee_ID: int
    Flight_no: str
    
    class Config:
        from_attributes = True

class BaggageSchema(BaseModel):
    Baggage_ID: int
    Baggae_weight: Optional[float] = None
    Baggage_status: Optional[str] = None
    Passenger_ID: int
    Flight_no: str
    
    class Config:
        from_attributes = True

class TicketSchema(BaseModel):
    Ticket_no: str
    Price: Optional[float] = None
    Seat_No: Optional[str] = None
    Booking_date: Optional[date] = None
    Flight_no: str
    Passenger_ID: int
    
    class Config:
        from_attributes = True

class FEAssignedSchema(BaseModel):
    Employee_ID: int
    Flight_no: str
    
    class Config:
        from_attributes = True

class BoardsSchema(BaseModel):
    Passenger_ID: int
    Flight_no: str
    
    class Config:
        from_attributes = True

class PassengerEmailSchema(BaseModel):
    Passenger_ID: int
    Passenger_email: str
    
    class Config:
        from_attributes = True

class PassengerPhoneSchema(BaseModel):
    Passenger_ID: int
    Passenger_phone: int
    
    class Config:
        from_attributes = True
