from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

auth_router = APIRouter()

@auth_router.post("/signin")
def signin(first_name: str, password: str, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(
        models.Employee.F_Name == first_name,
        models.Employee.pwd == password,
        models.Employee.Job_title == "Airport Head of Staff"
    ).first()
    if not employee:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # For simplicity, return minimal employee info; JWT or session can be added later
    return {
        "Employee_ID": employee.Employee_ID,
        "Employee_name": employee.Employee_name,
        "Age": None,  # Calculate age from Hire_date if needed
        "Job_title": employee.Job_title,
        "Airport_ID": employee.Airport_ID
    }
