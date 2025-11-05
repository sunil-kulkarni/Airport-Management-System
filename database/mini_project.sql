CREATE DATABASE IF NOT EXISTS airport_mngt_system;
USE airport_mngt_system;

-- Drop tables if they exist
DROP TABLE IF EXISTS FE_ASSIGNED, Boards, Passenger_Email, Passenger_phone,
Baggage, Ticket, Crew, Gate, Passenger, Flight, Employee, Aircraft, Airport, Airline;

-- 1. Airline Table
CREATE TABLE Airline (
    Airline_ID INT NOT NULL,
    Airline_name VARCHAR(255) NOT NULL,
    Headquarters_location VARCHAR(255),
    PRIMARY KEY (Airline_ID)
);

-- 2. Airport Table
CREATE TABLE Airport (
    Airport_ID VARCHAR(3) NOT NULL,
    Airport_location VARCHAR(255),
    IATA_code CHAR(3) NOT NULL UNIQUE,
    Airport_name VARCHAR(50),
    Airport_timezone VARCHAR(100),
    PRIMARY KEY (Airport_ID)
);

-- 3. Aircraft Table
CREATE TABLE Aircraft (
    Aircraft_ID VARCHAR(50) NOT NULL,
    capacity INT,
    Manufacturer VARCHAR(255),
    Model VARCHAR(255),
    Airline_ID INT NOT NULL,
    PRIMARY KEY (Aircraft_ID)
);

-- 4. Employee Table
CREATE TABLE Employee (
    Employee_ID INT NOT NULL,
    F_Name VARCHAR(100) NOT NULL,
    M_Initial CHAR(1),
    L_Name VARCHAR(100) NOT NULL,
    Employee_name VARCHAR(200),
    Hire_date DATE,
    Employee_Salary INT,
    Job_title VARCHAR(100),
    Airport_ID VARCHAR(3) NOT NULL,
    pwd VARCHAR(255),
    Assign INT, 
    PRIMARY KEY (Employee_ID)
);


-- 5. Flight Table (Gate assigned to Flight)
CREATE TABLE Flight (
    Flight_no VARCHAR(20) NOT NULL,
    Airline_name VARCHAR(255),
    Flight_status VARCHAR(20),
    arrival_time TIME,
    Airport_ID VARCHAR(3) NOT NULL,   
    Airline_ID INT NOT NULL,
    Gate_no VARCHAR(10),
    Terminal INT,
    src_city VARCHAR(255),          
    des_city VARCHAR(255),         
    PRIMARY KEY (Flight_no)
);


-- 6. Passenger Table
CREATE TABLE Passenger (
    Passenger_ID INT NOT NULL,
    F_Name VARCHAR(100) NOT NULL,
    M_Name VARCHAR(100),
    L_Name VARCHAR(100) NOT NULL,
    Passenger_name VARCHAR(200),
    DOB DATE,
    Passenger_Address VARCHAR(255),
    Flight_no VARCHAR(20) NOT NULL,
    Passenger_status VARCHAR(20),
    PRIMARY KEY (Passenger_ID)
);

-- 7. Gate Table (no longer references Flight)
CREATE TABLE Gate (
    Gate_no VARCHAR(10) NOT NULL,
    Airport_ID VARCHAR(3) NOT NULL,
    Terminal INT,
    PRIMARY KEY (Gate_no, Airport_ID)
);

-- 8. Crew Table
CREATE TABLE Crew (
    Crew_ID INT NOT NULL,
    Crew_role VARCHAR(100),
    Employee_ID INT NOT NULL UNIQUE,
    Flight_no VARCHAR(20),
    PRIMARY KEY (Crew_ID, Employee_ID)
);

-- 9. Baggage Table
CREATE TABLE Baggage (
    Baggage_ID INT NOT NULL,
    Baggae_weight DECIMAL(10, 2),
    Baggage_status VARCHAR(50),
    Passenger_ID INT NOT NULL,
    Flight_no VARCHAR(20) NOT NULL,
    PRIMARY KEY (Baggage_ID, Passenger_ID, Flight_no)
);

-- 10. Ticket Table
CREATE TABLE Ticket (
    Ticket_no VARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2),
    Seat_No VARCHAR(10),
    Booking_date DATE,
    Flight_no VARCHAR(20) NOT NULL,
    Passenger_ID INT NOT NULL,
    PRIMARY KEY (Ticket_no, Flight_no, Passenger_ID)
);

-- 11. FE_ASSIGNED Table
CREATE TABLE FE_ASSIGNED (
    Employee_ID INT NOT NULL,
    Flight_no VARCHAR(20) NOT NULL,
    PRIMARY KEY (Employee_ID, Flight_no)
);

-- 12. Boards Table
CREATE TABLE Boards (
    Passenger_ID INT NOT NULL,
    Flight_no VARCHAR(20) NOT NULL,
    PRIMARY KEY (Passenger_ID, Flight_no)
);

-- 13. Passenger_Email Table
CREATE TABLE Passenger_Email (
    Passenger_ID INT NOT NULL,
    Passenger_email VARCHAR(50) NOT NULL,
    PRIMARY KEY (Passenger_ID, Passenger_email)
);

-- 14. Passenger_phone Table
CREATE TABLE Passenger_phone (
    Passenger_ID INT NOT NULL,
    Passenger_phone BIGINT NOT NULL,
    PRIMARY KEY (Passenger_ID, Passenger_phone)
);

-- FOREIGN KEYS
-- FOREIGN KEYS with ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE Aircraft 
    ADD CONSTRAINT fk_aircraft_airline FOREIGN KEY (Airline_ID) REFERENCES Airline(Airline_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Employee 
    ADD CONSTRAINT fk_employee_airport FOREIGN KEY (Airport_ID) REFERENCES Airport(Airport_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Flight 
    ADD CONSTRAINT fk_flight_airport FOREIGN KEY (Airport_ID) REFERENCES Airport(Airport_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_flight_airline FOREIGN KEY (Airline_ID) REFERENCES Airline(Airline_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_flight_gate FOREIGN KEY (Gate_no, Airport_ID) REFERENCES Gate(Gate_no, Airport_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Passenger 
    ADD CONSTRAINT fk_passenger_flight FOREIGN KEY (Flight_no) REFERENCES Flight(Flight_no)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Crew 
    ADD CONSTRAINT fk_crew_employee FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;
    
ALTER TABLE Baggage 
    ADD CONSTRAINT fk_baggage_passenger FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_baggage_flight FOREIGN KEY (Flight_no) REFERENCES Flight(Flight_no)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Ticket 
    ADD CONSTRAINT fk_ticket_flight FOREIGN KEY (Flight_no) REFERENCES Flight(Flight_no)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_ticket_passenger FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE FE_ASSIGNED 
    ADD CONSTRAINT fk_fe_employee FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_fe_flight FOREIGN KEY (Flight_no) REFERENCES Flight(Flight_no)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Boards 
    ADD CONSTRAINT fk_boards_flight FOREIGN KEY (Flight_no) REFERENCES Flight(Flight_no)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_boards_passenger FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Passenger_Email 
    ADD CONSTRAINT fk_email_passenger FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Passenger_phone 
    ADD CONSTRAINT fk_phone_passenger FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================
-- DML COMMANDS - INSERT SAMPLE DATA
-- =====================================================

-- Insert Airlines (5 airlines)
INSERT INTO Airline (Airline_ID, Airline_name, Headquarters_location) VALUES
(1, 'IndiGo', 'Gurugram, India'),
(2, 'Air India', 'New Delhi, India'),
(3, 'Star Air', 'Bangalore, India'),
(4, 'SpiceJet', 'Gurugram, India'),
(5, 'Akasa Air', 'Mumbai, India');

-- Insert Airports (6 airports)
INSERT INTO Airport (Airport_ID, Airport_location, IATA_code, Airport_name, Airport_timezone) VALUES
('BLR', 'Bengaluru', 'BLR', 'Kempegowda International Airport', 'Asia/Kolkata'),
('HYD', 'Hyderabad', 'HYD', 'Rajiv Gandhi International Airport', 'Asia/Kolkata'),
('DEL', 'Delhi', 'DEL', 'Indira Gandhi International Airport', 'Asia/Kolkata'),
('BOM', 'Mumbai', 'BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Asia/Kolkata'),
('MAA', 'Chennai', 'MAA', 'Chennai International Airport', 'Asia/Kolkata'),
('CCU', 'Kolkata', 'CCU', 'Netaji Subhas Chandra Bose International Airport', 'Asia/Kolkata');

-- Insert Gates (3 gates, 2 terminals per airport, total 36 gates)
INSERT INTO Gate (Gate_no, Airport_ID, Terminal) VALUES
-- Bengaluru gates
('G01', 'BLR', 1), ('G02', 'BLR', 1), ('G03', 'BLR', 1),
('G04', 'BLR', 2), ('G05', 'BLR', 2), ('G06', 'BLR', 2),

-- Hyderabad gates
('G01', 'HYD', 1), ('G02', 'HYD', 1), ('G03', 'HYD', 1),
('G04', 'HYD', 2), ('G05', 'HYD', 2), ('G06', 'HYD', 2),

-- Delhi gates
('G01', 'DEL', 1), ('G02', 'DEL', 1), ('G03', 'DEL', 1),
('G04', 'DEL', 2), ('G05', 'DEL', 2), ('G06', 'DEL', 2),

-- Mumbai gates
('G01', 'BOM', 1), ('G02', 'BOM', 1), ('G03', 'BOM', 1),
('G04', 'BOM', 2), ('G05', 'BOM', 2), ('G06', 'BOM', 2),

-- Chennai gates
('G01', 'MAA', 1), ('G02', 'MAA', 1), ('G03', 'MAA', 1),
('G04', 'MAA', 2), ('G05', 'MAA', 2), ('G06', 'MAA', 2),

-- Kolkata gates
('G01', 'CCU', 1), ('G02', 'CCU', 1), ('G03', 'CCU', 1),
('G04', 'CCU', 2), ('G05', 'CCU', 2), ('G06', 'CCU', 2);

-- Insert Flights (only two statuses: 'Arrival' and 'Departure')
INSERT INTO Flight (Flight_no, Airline_name, Flight_status, arrival_time, Airport_ID, Airline_ID, Gate_no, Terminal, src_city, des_city) VALUES
-- Arrival Flights: destination = airport city
('6E1862', 'IndiGo', 'Arrival', '16:50:00', 'BLR', 1, 'G01', 1, 'Mauritius', 'Bengaluru'),
('IX1345', 'Air India', 'Arrival', '16:55:00', 'BLR', 2, 'G02', 1, 'Hyderabad', 'Bengaluru'),
('SR101', 'Star Air', 'Arrival', '17:10:00', 'BLR', 3, 'G04', 2, 'Chennai', 'Bengaluru'),
('SG356', 'SpiceJet', 'Arrival', '17:20:00', 'BLR', 4, 'G05', 2, 'Mumbai', 'Bengaluru'),
('AK789', 'Akasa Air', 'Arrival', '17:35:00', 'BLR', 5, 'G06', 2, 'Kolkata', 'Bengaluru'),

-- Departure Flights: source = airport city
('6E1234', 'IndiGo', 'Departure', '18:30:00', 'BLR', 1, 'G03', 1, 'Bengaluru', 'Delhi'),
('IX5432', 'Air India', 'Departure', '18:45:00', 'BLR', 2, 'G01', 1, 'Bengaluru', 'Hyderabad'),
('SR202', 'Star Air', 'Departure', '19:00:00', 'BLR', 3, 'G02', 1, 'Bengaluru', 'Mumbai'),
('SG789', 'SpiceJet', 'Departure', '19:15:00', 'BLR', 4, 'G04', 2, 'Bengaluru', 'Chennai'),
('AK456', 'Akasa Air', 'Departure', '19:30:00', 'BLR', 5, 'G05', 2, 'Bengaluru', 'Kolkata');

-- Insert Sample Aircraft
INSERT INTO Aircraft (Aircraft_ID, capacity, Manufacturer, Model, Airline_ID) VALUES
('VT-IFY', 180, 'Airbus', 'A320neo', 1),
('VT-IFZ', 180, 'Airbus', 'A320neo', 1),
('VT-AXJ', 238, 'Boeing', '737-800', 3);

-- Insert Employees (now 41 total: 1 head + 5 of each of 8 types)

-- 1. Airport Head of Staff (with password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(1001, 'abc', 'K', 'Kumar', 'Rajesh K Kumar', '2020-01-15', 150000, 'Airport Head of Staff', 'BLR',0, 'admin123');

-- 2. Check-in Handlers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID,Assign, pwd) VALUES
(2001, 'Priya', 'S', 'Sharma', 'Priya S Sharma', '2021-03-20', 45000, 'Check-in Handler', 'BLR', 0, NULL),
(2002, 'Amit', 'R', 'Singh', 'Amit R Singh', '2021-04-10', 45000, 'Check-in Handler', 'BLR', 0, NULL),
(2003, 'Sneha', 'M', 'Patel', 'Sneha M Patel', '2021-05-15', 46000, 'Check-in Handler', 'BLR', 0, NULL),
(2004, 'Vikram', 'J', 'Reddy', 'Vikram J Reddy', '2021-06-20', 45500, 'Check-in Handler', 'BLR', 0, NULL),
(2005, 'Anjali', 'T', 'Nair', 'Anjali T Nair', '2021-07-12', 47000, 'Check-in Handler', 'BLR', 0, NULL);

-- 3. Ground Engineers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(3001, 'Karthik', 'P', 'Murthy', 'Karthik P Murthy', '2020-08-15', 65000, 'Ground Engineer', 'BLR', 0, NULL),
(3002, 'Deepa', 'V', 'Iyer', 'Deepa V Iyer', '2020-09-20', 67000, 'Ground Engineer', 'BLR', 0, NULL),
(3003, 'Ravi', 'N', 'Desai', 'Ravi N Desai', '2020-10-05', 66000, 'Ground Engineer', 'BLR', 0, NULL),
(3004, 'Lakshmi', 'B', 'Rao', 'Lakshmi B Rao', '2020-11-18', 68000, 'Ground Engineer', 'BLR', 0, NULL),
(3005, 'Suresh', 'K', 'Pillai', 'Suresh K Pillai', '2020-12-22', 70000, 'Ground Engineer', 'BLR', 0, NULL);

-- 4. Immigration Handlers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(4001, 'Meera', 'D', 'Khanna', 'Meera D Khanna', '2021-01-10', 55000, 'Immigration Handler', 'BLR', 0, NULL),
(4002, 'Arun', 'L', 'Gupta', 'Arun L Gupta', '2021-02-14', 56000, 'Immigration Handler', 'BLR', 0, NULL),
(4003, 'Divya', 'S', 'Menon', 'Divya S Menon', '2021-03-18', 54000, 'Immigration Handler', 'BLR', 0, NULL),
(4004, 'Rohan', 'A', 'Joshi', 'Rohan A Joshi', '2021-04-22', 57000, 'Immigration Handler', 'BLR', 0, NULL),
(4005, 'Kavya', 'R', 'Bhat', 'Kavya R Bhat', '2021-05-28', 55500, 'Immigration Handler', 'BLR', 0, NULL),
(4006, 'Priya', 'N', 'Sharma', 'Priya N Sharma', '2021-06-15', 56500, 'Immigration Handler', 'BLR', 0, NULL),
(4007, 'Vikram', 'K', 'Reddy', 'Vikram K Reddy', '2021-07-20', 55800, 'Immigration Handler', 'BLR', 0, NULL),
(4008, 'Ananya', 'M', 'Iyer', 'Ananya M Iyer', '2021-08-12', 54500, 'Immigration Handler', 'BLR', 0, NULL),
(4009, 'Karthik', 'P', 'Nair', 'Karthik P Nair', '2021-09-05', 57200, 'Immigration Handler', 'BLR', 0, NULL),
(4010, 'Sneha', 'V', 'Pillai', 'Sneha V Pillai', '2021-10-18', 55300, 'Immigration Handler', 'BLR', 0, NULL);

-- Medical staff
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(9001, 'Arjun', 'M', 'Verma', 'Arjun M Verma', '2020-06-10', 50000, 'Medical staff', 'BLR', 0, NULL),
(9002, 'Pooja', 'K', 'Saxena', 'Pooja K Saxena', '2020-07-15', 51000, 'Medical staff', 'BLR', 0, NULL),
(9003, 'Rahul', 'T', 'Pandey', 'Rahul T Pandey', '2020-08-20', 49500, 'Medical staffs', 'BLR', 0, NULL);

-- 5. Security Handlers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(5001, 'Arjun', 'M', 'Verma', 'Arjun M Verma', '2020-06-10', 50000, 'Security Handler', 'BLR', 0, NULL),
(5002, 'Pooja', 'K', 'Saxena', 'Pooja K Saxena', '2020-07-15', 51000, 'Security Handler', 'BLR', 0, NULL),
(5003, 'Rahul', 'T', 'Pandey', 'Rahul T Pandey', '2020-08-20', 49500, 'Security Handler', 'BLR', 0, NULL),
(5004, 'Nisha', 'B', 'Shetty', 'Nisha B Shetty', '2020-09-25', 52000, 'Security Handler', 'BLR', 0, NULL),
(5005, 'Manish', 'V', 'Shah', 'Manish V Shah', '2020-10-30', 50500, 'Security Handler', 'BLR', 0, NULL);

-- 6. Retail Staff (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(6001, 'Swati', 'P', 'Mehta', 'Swati P Mehta', '2022-01-15', 35000, 'Retail Staff', 'BLR', 0, NULL),
(6002, 'Nikhil', 'R', 'Agarwal', 'Nikhil R Agarwal', '2022-02-20', 36000, 'Retail Staff', 'BLR', 0, NULL),
(6003, 'Tanvi', 'S', 'Chopra', 'Tanvi S Chopra', '2022-03-10', 34500, 'Retail Staff', 'BLR', 0, NULL),
(6004, 'Siddharth', 'K', 'Malhotra', 'Siddharth K Malhotra', '2022-04-18', 37000, 'Retail Staff', 'BLR', 0, NULL),
(6005, 'Ritu', 'M', 'Kapoor', 'Ritu M Kapoor', '2022-05-22', 35500, 'Retail Staff', 'BLR', 0, NULL);

-- Additional 20 pilots
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(7011, 'Ajinkya', 'S', 'Patil', 'Ajinkya S Patil', '2018-01-05', 185000, 'Pilot', 'BLR', 0, NULL),
(7012, 'Melissa', 'K', 'Reed', 'Melissa K Reed', '2018-02-10', 188000, 'Pilot', 'BLR', 0, NULL),
(7013, 'David', 'R', 'Brown', 'David R Brown', '2018-03-15', 179000, 'Pilot', 'BLR', 0, NULL),
(7014, 'Sonia', 'L', 'Garcia', 'Sonia L Garcia', '2018-04-20', 190000, 'Pilot', 'BLR', 0, NULL),
(7015, 'Michael', 'B', 'Wilson', 'Michael B Wilson', '2018-05-22', 192000, 'Pilot', 'BLR', 0, NULL),
(7016, 'Jessica', 'Y', 'Taylor', 'Jessica Y Taylor', '2018-06-25', 180000, 'Pilot', 'BLR', 0, NULL),
(7017, 'Robert', 'D', 'Martinez', 'Robert D Martinez', '2018-07-28', 187000, 'Pilot', 'BLR', 0, NULL),
(7018, 'Emily', 'M', 'Anderson', 'Emily M Anderson', '2018-08-30', 181000, 'Pilot', 'BLR', 0, NULL),
(7019, 'Brian', 'F', 'Thomas', 'Brian F Thomas', '2018-09-14', 183000, 'Pilot', 'BLR', 0, NULL),
(7020, 'Lauren', 'E', 'Jackson', 'Lauren E Jackson', '2018-10-10', 186000, 'Pilot', 'BLR', 0, NULL),
(7021, 'Anthony', 'J', 'White', 'Anthony J White', '2018-11-12', 184000, 'Pilot', 'BLR', 0, NULL),
(7022, 'Nicole', 'S', 'Harris', 'Nicole S Harris', '2018-12-15', 185000, 'Pilot', 'BLR', 0, NULL),
(7023, 'George', 'W', 'Martin', 'George W Martin', '2019-01-18', 182000, 'Pilot', 'BLR', 0, NULL),
(7024, 'Rachel', 'C', 'Thompson', 'Rachel C Thompson', '2019-02-20', 179000, 'Pilot','BLR', 0, NULL),
(7025, 'Eric', 'A', 'Garcia', 'Eric A Garcia', '2019-03-23', 188000, 'Pilot', 'BLR', 0, NULL),
(7026, 'Megan', 'B', 'Martinez', 'Megan B Martinez', '2019-04-25', 189000, 'Pilot', 'BLR', 0, NULL),
(7027, 'Kevin', 'R', 'Robinson', 'Kevin R Robinson', '2019-05-28', 180000, 'Pilot', 'BLR', 0, NULL),
(7028, 'Samantha', 'L', 'Clark', 'Samantha L Clark', '2019-06-30', 183000, 'Pilot', 'BLR', 0, NULL),
(7029, 'Jason', 'T', 'Rodriguez', 'Jason T Rodriguez', '2019-07-15', 181000, 'Pilot', 'BLR', 0, NULL),
(7030, 'Angela', 'F', 'Lewis', 'Angela F Lewis', '2019-08-20', 186000, 'Pilot', 'BLR', 0, NULL);


-- Additional 30 flight attendants
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, Assign, pwd) VALUES
(8011, 'Anna', 'M', 'Walker', 'Anna M Walker', '2022-01-01', 65000, 'Flight Attendant', 'BLR', 0, NULL),
(8012, 'James', 'S', 'Hall', 'James S Hall', '2022-01-05', 63000, 'Flight Attendant', 'BLR', 0, NULL),
(8013, 'Sara', 'T', 'Allen', 'Sara T Allen', '2022-01-10', 62000, 'Flight Attendant', 'BLR', 0, NULL),
(8014, 'Mark', 'D', 'Young', 'Mark D Young', '2022-01-15', 64000, 'Flight Attendant', 'BLR', 0, NULL),
(8015, 'Linda', 'K', 'Hernandez', 'Linda K Hernandez', '2022-01-20', 66000, 'Flight Attendant', 'BLR', 0, NULL),
(8016, 'Steven', 'P', 'King', 'Steven P King', '2022-01-25', 63500, 'Flight Attendant', 'BLR', 0, NULL),
(8017, 'Nancy', 'R', 'Wright', 'Nancy R Wright', '2022-01-30', 64000, 'Flight Attendant', 'BLR', 0, NULL),
(8018, 'Paul', 'L', 'Lopez', 'Paul L Lopez', '2022-02-05', 62000, 'Flight Attendant', 'BLR', 0, NULL),
(8019, 'Karen', 'M', 'Hill', 'Karen M Hill', '2022-02-10', 65000, 'Flight Attendant', 'BLR', 0, NULL),
(8020, 'Daniel', 'J', 'Scott', 'Daniel J Scott', '2022-02-15', 63000, 'Flight Attendant', 'BLR', 0, NULL),
(8021, 'Jessica', 'H', 'Green', 'Jessica H Green', '2022-02-20', 63500, 'Flight Attendant', 'BLR', 0, NULL),
(8022, 'Donald', 'W', 'Adams', 'Donald W Adams', '2022-02-25', 64000, 'Flight Attendant', 'BLR', 0, NULL),
(8023, 'Ashley', 'F', 'Baker', 'Ashley F Baker', '2022-03-01', 62000, 'Flight Attendant', 'BLR', 0, NULL),
(8024, 'Brian', 'G', 'Nelson', 'Brian G Nelson', '2022-03-05', 65000, 'Flight Attendant', 'BLR', 0, NULL),
(8025, 'Amber', 'C', 'Carter', 'Amber C Carter', '2022-03-10', 63000, 'Flight Attendant', 'BLR', 0, NULL),
(8026, 'Eric', 'Q', 'Mitchell', 'Eric Q Mitchell', '2022-03-15', 62500, 'Flight Attendant', 'BLR', 0, NULL),
(8027, 'Megan', 'V', 'Perez', 'Megan V Perez', '2022-03-20', 64000, 'Flight Attendant', 'BLR', 0, NULL),
(8028, 'George', 'B', 'Roberts', 'George B Roberts', '2022-03-25', 64500, 'Flight Attendant', 'BLR', 0, NULL),
(8029, 'Emily', 'M', 'Turner', 'Emily M Turner', '2022-03-30', 62000, 'Flight Attendant', 'BLR', 0, NULL),
(8030, 'Samuel', 'N', 'Phillips', 'Samuel N Phillips', '2022-04-05', 63500, 'Flight Attendant', 'BLR', 0, NULL),
(8031, 'Olivia', 'R', 'Campbell', 'Olivia R Campbell', '2022-04-10', 64000, 'Flight Attendant', 'BLR', 0,NULL),
(8032, 'Jonathan', 'K', 'Parker', 'Jonathan K Parker', '2022-04-15', 63000, 'Flight Attendant', 'BLR', 0, NULL),
(8033, 'Sophia', 'L', 'Evans', 'Sophia L Evans', '2022-04-20', 61000, 'Flight Attendant', 'BLR', 0, NULL),
(8034, 'Andrew', 'T', 'Edwards', 'Andrew T Edwards', '2022-04-25', 62000, 'Flight Attendant', 'BLR', 0, NULL),
(8035, 'Lauren', 'J', 'Collins', 'Lauren J Collins', '2022-04-30', 63000, 'Flight Attendant', 'BLR', 0, NULL),
(8036, 'Brandon', 'M', 'Stewart', 'Brandon M Stewart', '2022-05-05', 64000, 'Flight Attendant', 'BLR', 0, NULL),
(8037, 'Rachel', 'C', 'Sanchez', 'Rachel C Sanchez', '2022-05-10', 63500, 'Flight Attendant', 'BLR', 0, NULL),
(8038, 'Justin', 'D', 'Morris', 'Justin D Morris', '2022-05-15', 62500, 'Flight Attendant', 'BLR', 0, NULL),
(8039, 'Michelle', 'E', 'Rogers', 'Michelle E Rogers', '2022-05-20', 63000, 'Flight Attendant', 'BLR', 0, NULL),
(8040, 'Benjamin', 'F', 'Reed', 'Benjamin F Reed', '2022-05-25', 62000, 'Flight Attendant', 'BLR', 0, NULL);



-- Insert all pilots into Crew as 'Pilot' with Crew_ID and null Flight_no
INSERT INTO Crew (Crew_ID, Crew_role, Employee_ID, Flight_no) VALUES
(4001, 'Pilot', 7011, NULL),
(4002, 'Pilot', 7012, NULL),
(4003, 'Pilot', 7013, NULL),
(4004, 'Pilot', 7014, NULL),
(4005, 'Pilot', 7015, NULL),
(4006, 'Pilot', 7016, NULL),
(4007, 'Pilot', 7017, NULL),
(4008, 'Pilot', 7018, NULL),
(4009, 'Pilot', 7019, NULL),
(4010, 'Pilot', 7020, NULL),
(4011, 'Pilot', 7021, NULL),
(4012, 'Pilot', 7022, NULL),
(4013, 'Pilot', 7023, NULL),
(4014, 'Pilot', 7024, NULL),
(4015, 'Pilot', 7025, NULL),
(4016, 'Pilot', 7026, NULL),
(4017, 'Pilot', 7027, NULL),
(4018, 'Pilot', 7028, NULL),
(4019, 'Pilot', 7029, NULL),
(4020, 'Pilot', 7030, NULL);

-- Insert all flight attendants with Crew_ID, null Flight_no
INSERT INTO Crew (Crew_ID, Crew_role, Employee_ID, Flight_no) VALUES
(5001, 'Flight Attendant', 8011, NULL),
(5002, 'Flight Attendant', 8012, NULL),
(5003, 'Flight Attendant', 8013, NULL),
(5004, 'Flight Attendant', 8014, NULL),
(5005, 'Flight Attendant', 8015, NULL),
(5006, 'Flight Attendant', 8016, NULL),
(5007, 'Flight Attendant', 8017, NULL),
(5008, 'Flight Attendant', 8018, NULL),
(5009, 'Flight Attendant', 8019, NULL),
(5010, 'Flight Attendant', 8020, NULL),
(5011, 'Flight Attendant', 8021, NULL),
(5012, 'Flight Attendant', 8022, NULL),
(5013, 'Flight Attendant', 8023, NULL),
(5014, 'Flight Attendant', 8024, NULL),
(5015, 'Flight Attendant', 8025, NULL),
(5016, 'Flight Attendant', 8026, NULL),
(5017, 'Flight Attendant', 8027, NULL),
(5018, 'Flight Attendant', 8028, NULL),
(5019, 'Flight Attendant', 8029, NULL),
(5020, 'Flight Attendant', 8030, NULL),
(5021, 'Flight Attendant', 8031, NULL),
(5022, 'Flight Attendant', 8032, NULL),
(5023, 'Flight Attendant', 8033, NULL),
(5024, 'Flight Attendant', 8034, NULL),
(5025, 'Flight Attendant', 8035, NULL),
(5026, 'Flight Attendant', 8036, NULL),
(5027, 'Flight Attendant', 8037, NULL),
(5028, 'Flight Attendant', 8038, NULL),
(5029, 'Flight Attendant', 8039, NULL),
(5030, 'Flight Attendant', 8040, NULL);



-- Assign first 6 pilots to flights
UPDATE Crew SET Flight_no = '6E1862' WHERE Employee_ID IN (7011, 7012); -- 2 pilots to 6E1862
UPDATE Crew SET Flight_no = 'IX1345' WHERE Employee_ID IN (7013, 7014); -- 2 pilots to IX1345
UPDATE Crew SET Flight_no = '6E1234' WHERE Employee_ID IN (7015, 7016); -- 2 pilots to 6E1234

-- Assign 12 flight attendants evenly to those flights
UPDATE Crew SET Flight_no = '6E1862' WHERE Employee_ID IN (8011, 8012, 8013);
UPDATE Crew SET Flight_no = 'IX1345' WHERE Employee_ID IN (8015, 8016, 8017);
UPDATE Crew SET Flight_no = '6E1234' WHERE Employee_ID IN (8019, 8020, 8021);


INSERT INTO Passenger (Passenger_ID, F_Name, M_Name, L_Name, Passenger_name, DOB, Passenger_Address, Flight_no, Passenger_status)
VALUES 
  -- 6E1862
  (1, 'John', 'A', 'Doe', 'John A Doe', '1990-01-01', '123 Street A', '6E1862', 'Normal'),
  (2, 'Jane', 'B', 'Smith', 'Jane B Smith', '1988-02-02', '456 Street B', '6E1862', 'baggage overweight'),
  (3, 'Mike', NULL, 'Brown', 'Mike Brown', '1991-03-03', '789 Street C', '6E1862', 'illness'),
  (4, 'Alice', 'C', 'White', 'Alice C White', '1992-04-04', '321 Street D', '6E1862', 'Normal'),
  (5, 'Bob', NULL, 'Green', 'Bob Green', '1989-05-05', '654 Street E', '6E1862', 'Normal'),

  -- IX1345
  (6, 'Lily', 'D', 'Jones', 'Lily D Jones', '1993-06-06', '111 Second St', 'IX1345', 'Normal'),
  (7, 'Tom', NULL, 'King', 'Tom King', '1987-07-07', '222 Third St', 'IX1345', 'baggage overweight'),
  (8, 'Emma', 'E', 'Scott', 'Emma E Scott', '1994-08-08', '333 Fourth St', 'IX1345', 'Normal'),
  (9, 'David', NULL, 'Lee', 'David Lee', '1990-09-09', '444 Fifth St', 'IX1345', 'Normal'),
  (10, 'Eva', 'F', 'Clark', 'Eva F Clark', '1985-10-10', '555 Sixth St', 'IX1345', 'Theft'),

  -- SR101
  (11, 'James', 'G', 'Hill', 'James G Hill', '1991-11-11', '666 Seventh St', 'SR101', 'illness'),
  (12, 'Sophia', NULL, 'Young', 'Sophia Young', '1988-12-12', '777 Eighth St', 'SR101', 'Normal'),
  (13, 'Chris', 'H', 'Walker', 'Chris H Walker', '1992-01-13', '888 Ninth St', 'SR101', 'baggage overweight'),
  (14, 'Grace', NULL, 'White', 'Grace White', '1990-02-14', '999 Tenth St', 'SR101', 'Normal'),
  (15, 'Kyle', 'I', 'Hall', 'Kyle I Hall', '1987-03-15', '1011 Eleventh St', 'SR101', 'Normal'),

  -- SG356
  (16, 'Megan', NULL, 'Wright', 'Megan Wright', '1993-04-16', '1212 Twelfth St', 'SG356', 'baggage overweight'),
  (17, 'Ryan', 'J', 'Green', 'Ryan J Green', '1989-05-17', '1313 Thirteenth St', 'SG356', 'Normal'),
  (18, 'Ella', NULL, 'King', 'Ella King', '1991-06-18', '1414 Fourteenth St', 'SG356', 'Normal'),
  (19, 'Jacob', 'K', 'Hill', 'Jacob K Hill', '1990-07-19', '1515 Fifteenth St', 'SG356', 'theft'),
  (20, 'Anna', NULL, 'Scott', 'Anna Scott', '1988-08-20', '1616 Sixteenth St', 'SG356', 'Normal'),

  -- AK789
  (21, 'Nate', 'L', 'Young', 'Nate L Young', '1992-09-21', '1717 Seventeenth St', 'AK789', 'Normal'),
  (22, 'Zoe', NULL, 'Adams', 'Zoe Adams', '1987-10-22', '1818 Eighteenth St', 'AK789', 'baggage overweight'),
  (23, 'Owen', 'M', 'Clark', 'Owen M Clark', '1990-11-23', '1919 Nineteenth St', 'AK789', 'Normal'),
  (24, 'Chloe', NULL, 'Lewis', 'Chloe Lewis', '1991-12-24', '2020 Twentieth St', 'AK789', 'Normal'),
  (25, 'Ethan', 'N', 'Walker', 'Ethan N Walker', '1988-01-25', '2121 TwentyFirst St', 'AK789', 'Normal'),

  -- 6E1234
  (26, 'Mia', 'O', 'Roberts', 'Mia O Roberts', '1993-02-26', '2222 TwentySecond St', '6E1234', 'Normal'),
  (27, 'Liam', NULL, 'Walker', 'Liam Walker', '1991-03-27', '2323 TwentyThird St', '6E1234', 'Normal'),
  (28, 'Sophia', 'P', 'Hall', 'Sophia P Hall', '1990-04-28', '2424 TwentyFourth St', '6E1234', 'baggage overweight'),
  (29, 'Mason', NULL, 'King', 'Mason King', '1988-05-29', '2525 TwentyFifth St', '6E1234', 'Normal'),
  (30, 'Emma', 'Q', 'Hill', 'Emma Q Hill', '1992-06-30', '2626 TwentySixth St', '6E1234', 'Normal'),

  -- IX5432
  (31, 'Oliver', 'R', 'Scott', 'Oliver R Scott', '1989-07-31', '2727 TwentySeventh St', 'IX5432', 'Normal'),
  (32, 'Ava', NULL, 'Green', 'Ava Green', '1990-08-01', '2828 TwentyEighth St', 'IX5432', 'Normal'),
  (33, 'Elijah', 'S', 'Brown', 'Elijah S Brown', '1991-09-02', '2929 TwentyNinth St', 'IX5432', 'baggage overweight'),
  (34, 'Isabella', NULL, 'White', 'Isabella White', '1992-10-03', '3030 Thirtieth St', 'IX5432', 'Normal'),
  (35, 'James', 'T', 'Taylor', 'James T Taylor', '1988-11-04', '3131 ThirtyFirst St', 'IX5432', 'Normal'),

  -- SR202
  (36, 'Charlotte', 'U', 'Harris', 'Charlotte U Harris', '1993-12-05', '3232 ThirtySecond St', 'SR202', 'Normal'),
  (37, 'Benjamin', NULL, 'Martin', 'Benjamin Martin', '1991-01-06', '3333 ThirtyThird St', 'SR202', 'Normal'),
  (38, 'Amelia', 'V', 'Thompson', 'Amelia V Thompson', '1990-02-07', '3434 ThirtyFourth St', 'SR202', 'baggage overweight'),
  (39, 'Evelyn', NULL, 'Garcia', 'Evelyn Garcia', '1989-03-08', '3535 ThirtyFifth St', 'SR202', 'Normal'),
  (40, 'Logan', 'W', 'Martinez', 'Logan W Martinez', '1992-04-09', '3636 ThirtySixth St', 'SR202', 'Normal'),

  -- SG789
  (41, 'Harper', NULL, 'Robinson', 'Harper Robinson', '1993-05-10', '3737 ThirtySeventh St', 'SG789', 'Normal'),
  (42, 'Jackson', 'X', 'Clark', 'Jackson X Clark', '1991-06-11', '3838 ThirtyEighth St', 'SG789', 'baggage overweight'),
  (43, 'Mila', NULL, 'Rodriguez', 'Mila Rodriguez', '1990-07-12', '3939 ThirtyNinth St', 'SG789', 'Normal'),
  (44, 'Sebastian', 'Y', 'Lewis', 'Sebastian Y Lewis', '1989-08-13', '4040 Fortieth St', 'SG789', 'Normal'),
  (45, 'Ella', NULL, 'Lee', 'Ella Lee', '1992-09-14', '4141 FortyFirst St', 'SG789', 'Normal'),

  -- AK456
  (46, 'Zachary', 'Z', 'Walker', 'Zachary Z Walker', '1993-10-15', '4242 FortySecond St', 'AK456', 'baggage overweight'),
  (47, 'Victoria', NULL, 'Wright', 'Victoria Wright', '1991-11-16', '4343 FortyThird St', 'AK456', 'Normal'),
  (48, 'Nathan', 'A', 'Hill', 'Nathan A Hill', '1990-12-17', '4444 FortyFourth St', 'AK456', 'Normal'),
  (49, 'Luna', NULL, 'Scott', 'Luna Scott', '1989-01-18', '4545 FortyFifth St', 'AK456', 'Normal'),
  (50, 'Sebastian', 'B', 'King', 'Sebastian B King', '1992-02-19', '4646 FortySixth St', 'AK456', 'Normal');


-- Boards Table: Each passenger boards their assigned flight
INSERT INTO Boards (Passenger_ID, Flight_no) VALUES 
(1, '6E1862'), (2, '6E1862'), (3, '6E1862'), (4, '6E1862'), (5, '6E1862'),
(6, 'IX1345'), (7, 'IX1345'), (8, 'IX1345'), (9, 'IX1345'), (10, 'IX1345'),
(11, 'SR101'), (12, 'SR101'), (13, 'SR101'), (14, 'SR101'), (15, 'SR101'),
(16, 'SG356'), (17, 'SG356'), (18, 'SG356'), (19, 'SG356'), (20, 'SG356'),
(21, 'AK789'), (22, 'AK789'), (23, 'AK789'), (24, 'AK789'), (25, 'AK789'),
(26, '6E1234'), (27, '6E1234'), (28, '6E1234'), (29, '6E1234'), (30, '6E1234'),
(31, 'IX5432'), (32, 'IX5432'), (33, 'IX5432'), (34, 'IX5432'), (35, 'IX5432'),
(36, 'SR202'), (37, 'SR202'), (38, 'SR202'), (39, 'SR202'), (40, 'SR202'),
(41, 'SG789'), (42, 'SG789'), (43, 'SG789'), (44, 'SG789'), (45, 'SG789'),
(46, 'AK456'), (47, 'AK456'), (48, 'AK456'), (49, 'AK456'), (50, 'AK456');

-- Passenger_Email Table: Assign emails matching passenger IDs
INSERT INTO Passenger_Email (Passenger_ID, Passenger_email) VALUES
(1, 'john.doe@example.com'), (2, 'jane.smith@example.com'), (3, 'mike.brown@example.com'), (4, 'alice.white@example.com'), (5, 'bob.green@example.com'),
(6, 'lily.jones@example.com'), (7, 'tom.king@example.com'), (8, 'emma.scott@example.com'), (9, 'david.lee@example.com'), (10, 'eva.clark@example.com'),
(11, 'james.hill@example.com'), (12, 'sophia.young@example.com'), (13, 'chris.walker@example.com'), (14, 'grace.white@example.com'), (15, 'kyle.hall@example.com'),
(16, 'megan.wright@example.com'), (17, 'ryan.green@example.com'), (18, 'ella.king@example.com'), (19, 'jacob.hill@example.com'), (20, 'anna.scott@example.com'),
(21, 'nate.young@example.com'), (22, 'zoe.adams@example.com'), (23, 'owen.clark@example.com'), (24, 'chloe.lewis@example.com'), (25, 'ethan.walker@example.com'),
(26, 'mia.roberts@example.com'), (27, 'liam.walker@example.com'), (28, 'sophia.hall@example.com'), (29, 'mason.king@example.com'), (30, 'emma.hill@example.com'),
(31, 'oliver.scott@example.com'), (32, 'ava.green@example.com'), (33, 'elijah.brown@example.com'), (34, 'isabella.white@example.com'), (35, 'james.taylor@example.com'),
(36, 'charlotte.harris@example.com'), (37, 'benjamin.martin@example.com'), (38, 'amelia.thompson@example.com'), (39, 'evelyn.garcia@example.com'), (40, 'logan.martinez@example.com'),
(41, 'harper.robinson@example.com'), (42, 'jackson.clark@example.com'), (43, 'mila.rodriguez@example.com'), (44, 'sebastian.lewis@example.com'), (45, 'ella.lee@example.com'),
(46, 'zachary.walker@example.com'), (47, 'victoria.wright@example.com'), (48, 'nathan.hill@example.com'), (49, 'luna.scott@example.com'), (50, 'sebastian.king@example.com');

-- Passenger_phone Table: Assign dummy phone numbers
INSERT INTO Passenger_phone (Passenger_ID, Passenger_phone) VALUES
(1, 9123456001), (2, 9123456002), (3, 9123456003), (4, 9123456004), (5, 9123456005),
(6, 9123456006), (7, 9123456007), (8, 9123456008), (9, 9123456009), (10, 9123456010),
(11, 9123456011), (12, 9123456012), (13, 9123456013), (14, 9123456014), (15, 9123456015),
(16, 9123456016), (17, 9123456017), (18, 9123456018), (19, 9123456019), (20, 9123456020),
(21, 9123456021), (22, 9123456022), (23, 9123456023), (24, 9123456024), (25, 9123456025),
(26, 9123456026), (27, 9123456027), (28, 9123456028), (29, 9123456029), (30, 9123456030),
(31, 9123456031), (32, 9123456032), (33, 9123456033), (34, 9123456034), (35, 9123456035),
(36, 9123456036), (37, 9123456037), (38, 9123456038), (39, 9123456039), (40, 9123456040),
(41, 9123456041), (42, 9123456042), (43, 9123456043), (44, 9123456044), (45, 9123456045),
(46, 9123456046), (47, 9123456047), (48, 9123456048), (49, 9123456049), (50, 9123456050);

-- Ticket Table: assign tickets per passenger with dummy data
INSERT INTO Ticket (Ticket_no, Price, Seat_No, Booking_date, Flight_no, Passenger_ID) VALUES
('T001', 5000.00, '12A', '2025-01-10', '6E1862', 1),
('T002', 5200.00, '12B', '2025-01-11', '6E1862', 2),
('T003', 5400.00, '12C', '2025-01-12', '6E1862', 3),
('T004', 5600.00, '12D', '2025-01-13', '6E1862', 4),
('T005', 5800.00, '12E', '2025-01-14', '6E1862', 5),

('T006', 6000.00, '14A', '2025-01-15', 'IX1345', 6),
('T007', 6200.00, '14B', '2025-01-16', 'IX1345', 7),
('T008', 6400.00, '14C', '2025-01-17', 'IX1345', 8),
('T009', 6600.00, '14D', '2025-01-18', 'IX1345', 9),
('T010', 6800.00, '14E', '2025-01-19', 'IX1345', 10),

('T011', 7000.00, '16A', '2025-01-20', 'SR101', 11),
('T012', 7200.00, '16B', '2025-01-21', 'SR101', 12),
('T013', 7400.00, '16C', '2025-01-22', 'SR101', 13),
('T014', 7600.00, '16D', '2025-01-23', 'SR101', 14),
('T015', 7800.00, '16E', '2025-01-24', 'SR101', 15),

('T016', 8000.00, '18A', '2025-01-25', 'SG356', 16),
('T017', 8200.00, '18B', '2025-01-26', 'SG356', 17),
('T018', 8400.00, '18C', '2025-01-27', 'SG356', 18),
('T019', 8600.00, '18D', '2025-01-28', 'SG356', 19),
('T020', 8800.00, '18E', '2025-01-29', 'SG356', 20),

('T021', 9000.00, '20A', '2025-01-30', 'AK789', 21),
('T022', 9200.00, '20B', '2025-01-31', 'AK789', 22),
('T023', 9400.00, '20C', '2025-02-01', 'AK789', 23),
('T024', 9600.00, '20D', '2025-02-02', 'AK789', 24),
('T025', 9800.00, '20E', '2025-02-03', 'AK789', 25),

('T026', 10000.00, '22A', '2025-02-04', '6E1234', 26),
('T027', 10200.00, '22B', '2025-02-05', '6E1234', 27),
('T028', 10400.00, '22C', '2025-02-06', '6E1234', 28),
('T029', 10600.00, '22D', '2025-02-07', '6E1234', 29),
('T030', 10800.00, '22E', '2025-02-08', '6E1234', 30),

('T031', 11000.00, '24A', '2025-02-09', 'IX5432', 31),
('T032', 11200.00, '24B', '2025-02-10', 'IX5432', 32),
('T033', 11400.00, '24C', '2025-02-11', 'IX5432', 33),
('T034', 11600.00, '24D', '2025-02-12', 'IX5432', 34),
('T035', 11800.00, '24E', '2025-02-13', 'IX5432', 35),

('T036', 12000.00, '26A', '2025-02-14', 'SR202', 36),
('T037', 12200.00, '26B', '2025-02-15', 'SR202', 37),
('T038', 12400.00, '26C', '2025-02-16', 'SR202', 38),
('T039', 12600.00, '26D', '2025-02-17', 'SR202', 39),
('T040', 12800.00, '26E', '2025-02-18', 'SR202', 40),

('T041', 13000.00, '28A', '2025-02-19', 'SG789', 41),
(42, 13200.00, '28B', '2025-02-20', 'SG789', 42),
('T043', 13400.00, '28C', '2025-02-21', 'SG789', 43),
('T044', 13600.00, '28D', '2025-02-22', 'SG789', 44),
('T045', 13800.00, '28E', '2025-02-23', 'SG789', 45),

('T046', 14000.00, '30A', '2025-02-24', 'AK456', 46),
('T047', 14200.00, '30B', '2025-02-25', 'AK456', 47),
('T048', 14400.00, '30C', '2025-02-26', 'AK456', 48),
('T049', 14600.00, '30D', '2025-02-27', 'AK456', 49),
('T050', 14800.00, '30E', '2025-02-28', 'AK456', 50);

-- Baggage records for each passenger (one per passenger) 
INSERT INTO Baggage (Baggage_ID, Baggae_weight, Baggage_status, Passenger_ID, Flight_no) VALUES
-- 6E1862
(1, 25.5, 'Loaded', 1, '6E1862'),
(2, 32.2, 'Special Check', 2, '6E1862'), -- flagged, overweight
(3, 21.7, 'Loaded', 3, '6E1862'),
(4, 29.3, 'Loaded', 4, '6E1862'),
(5, 27.0, 'Loaded', 5, '6E1862'),

-- IX1345
(6, 24.1, 'Loaded', 6, 'IX1345'),
(7, 33.5, 'Special Check', 7, 'IX1345'), -- flagged, overweight
(8, 28.4, 'Loaded', 8, 'IX1345'),
(9, 30.0, 'Loaded', 9, 'IX1345'),
(10, 22.9, 'Loaded', 10, 'IX1345'),

-- SR101
(11, 27.4, 'Loaded', 11, 'SR101'),
(12, 23.3, 'Loaded', 12, 'SR101'),
(13, 35.8, 'Special Check', 13, 'SR101'), -- flagged, overweight
(14, 26.5, 'Loaded', 14, 'SR101'),
(15, 31.2, 'Loaded', 15, 'SR101'),

-- SG356
(16, 36.1, 'Special Check', 16, 'SG356'), -- flagged, overweight
(17, 29.4, 'Loaded', 17, 'SG356'),
(18, 25.9, 'Loaded', 18, 'SG356'),
(19, 27.8, 'Loaded', 19, 'SG356'),
(20, 24.7, 'Loaded', 20, 'SG356'),

-- AK789
(21, 28.5, 'Loaded', 21, 'AK789'),
(22, 33.8, 'Special Check', 22, 'AK789'), -- flagged, overweight
(23, 26.2, 'Loaded', 23, 'AK789'),
(24, 22.3, 'Loaded', 24, 'AK789'),
(25, 23.9, 'Loaded', 25, 'AK789'),

-- 6E1234
(26, 30.1, 'Loaded', 26, '6E1234'),
(27, 24.4, 'Loaded', 27, '6E1234'),
(28, 34.5, 'Special Check', 28, '6E1234'), -- flagged, overweight
(29, 26.1, 'Loaded', 29, '6E1234'),
(30, 28.6, 'Loaded', 30, '6E1234'),

-- IX5432
(31, 20.9, 'Loaded', 31, 'IX5432'),
(32, 23.7, 'Loaded', 32, 'IX5432'),
(33, 36.4, 'Special Check', 33, 'IX5432'), -- flagged, overweight
(34, 27.3, 'Loaded', 34, 'IX5432'),
(35, 28.2, 'Loaded', 35, 'IX5432'),

-- SR202
(36, 29.1, 'Loaded', 36, 'SR202'),
(37, 28.9, 'Loaded', 37, 'SR202'),
(38, 33.1, 'Special Check', 38, 'SR202'), -- flagged, overweight
(39, 27.6, 'Loaded', 39, 'SR202'),
(40, 26.7, 'Loaded', 40, 'SR202'),

-- SG789
(41, 22.0, 'Loaded', 41, 'SG789'),
(42, 34.9, 'Special Check', 42, 'SG789'), -- flagged, overweight
(43, 27.0, 'Loaded', 43, 'SG789'),
(44, 23.2, 'Loaded', 44, 'SG789'),
(45, 21.3, 'Loaded', 45, 'SG789'),

-- AK456
(46, 38.2, 'Special Check', 46, 'AK456'), -- flagged, overweight
(47, 27.2, 'Loaded', 47, 'AK456'),
(48, 26.4, 'Loaded', 48, 'AK456'),
(49, 23.1, 'Loaded', 49, 'AK456'),
(50, 21.9, 'Loaded', 50, 'AK456');


-- Trigger for deleting employee
DELIMITER $$

CREATE TRIGGER after_crew_delete
AFTER DELETE ON Crew
FOR EACH ROW
BEGIN
    DELETE FROM Employee 
    WHERE Employee_ID = OLD.Employee_ID 
      AND Employee_ID NOT IN (SELECT DISTINCT Employee_ID FROM Crew WHERE Employee_ID = OLD.Employee_ID);
END$$

DELIMITER ;

-- Trigger for updating passenger
DELIMITER $$

CREATE TRIGGER UpdatePassengerStatusAfterBaggageUpdate
AFTER UPDATE ON Baggage
FOR EACH ROW
BEGIN
  IF NEW.Baggae_weight < 33 THEN
    UPDATE Passenger
    SET Passenger_status = 'Normal'
    WHERE Passenger_ID = NEW.Passenger_ID;
  END IF;
END$$

DELIMITER ;



-- Function to get average salary
DROP FUNCTION IF EXISTS GetAverageSalary;
DELIMITER $$
CREATE FUNCTION GetAverageSalary()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE avgSalary INT DEFAULT 0;
    SELECT IFNULL(AVG(Employee_Salary), 0) INTO avgSalary FROM Employee;
    RETURN avgSalary;
END $$
DELIMITER ;

-- Procedure to get employee stats
DELIMITER $$
DROP PROCEDURE IF EXISTS GetEmployeeStats;
CREATE PROCEDURE GetEmployeeStats()
BEGIN
  SELECT Job_title, COUNT(*) AS emp_count, SUM(Employee_Salary) AS total_salary
  FROM Employee
  GROUP BY Job_title;
END$$
DELIMITER ;


