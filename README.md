# Airport Management System
This project is made using React-FastAPI-MySQL 


### Clone the project
```bash
git clone https://github.com/sunil-kulkarni/Airport-Management-System.git
```

### Install the necessary libraries
#### For frontend
```bash
cd airport-management-frontend
npm i
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
mysql -u root -p < database/mini_project.sql
```

### Start the Backend

```bash
uvicorn main:app --reload
```

### Start the Frontend

```bash
cd airport-management-frontend/src
npm start
```

