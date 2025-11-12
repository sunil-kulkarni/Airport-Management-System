# Airport Management System
This project is made using React-FastAPI-MySQL 

This application is designed for airport head of staff who can access all the details pertaining to airport operations and status at that moment 

### Clone the project
```bash
git clone https://github.com/sunil-kulkarni/Airport-Management-System.git
```

### Install the necessary libraries
#### For frontend
```bash
cd airport-management-frontend
npm i # install the necessary packages
```

#### For backend
Create a virtual environment
```bash
python3 -m venv .venv
``` 
Install the modules
```bash
pip install -r requirements.txt
```
### Initialise the database
```bash
mysql -u root -p < database/mini_project.sql # for loading the commands from sql file
```

### Start the Backend

```bash
cd airport-management-backend
uvicorn main:app --reload
```

### Start the Frontend

```bash
cd airport-management-frontend/src
npm start
```

