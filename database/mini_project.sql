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
    pwd VARCHAR(255),  -- Changed from INT
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
    passport_no VARCHAR(50) UNIQUE,
    Passenger_Address VARCHAR(255),
    Flight_no VARCHAR(20) NOT NULL,
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
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(1001, 'Rajesh', 'K', 'Kumar', 'Rajesh K Kumar', '2020-01-15', 150000, 'Airport Head of Staff', 'BLR', 'admin123');

-- 2. Check-in Handlers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(2001, 'Priya', 'S', 'Sharma', 'Priya S Sharma', '2021-03-20', 45000, 'Check-in Handler', 'BLR', NULL),
(2002, 'Amit', 'R', 'Singh', 'Amit R Singh', '2021-04-10', 45000, 'Check-in Handler', 'BLR', NULL),
(2003, 'Sneha', 'M', 'Patel', 'Sneha M Patel', '2021-05-15', 46000, 'Check-in Handler', 'BLR', NULL),
(2004, 'Vikram', 'J', 'Reddy', 'Vikram J Reddy', '2021-06-20', 45500, 'Check-in Handler', 'BLR', NULL),
(2005, 'Anjali', 'T', 'Nair', 'Anjali T Nair', '2021-07-12', 47000, 'Check-in Handler', 'BLR', NULL);

-- 3. Ground Engineers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(3001, 'Karthik', 'P', 'Murthy', 'Karthik P Murthy', '2020-08-15', 65000, 'Ground Engineer', 'BLR', NULL),
(3002, 'Deepa', 'V', 'Iyer', 'Deepa V Iyer', '2020-09-20', 67000, 'Ground Engineer', 'BLR', NULL),
(3003, 'Ravi', 'N', 'Desai', 'Ravi N Desai', '2020-10-05', 66000, 'Ground Engineer', 'BLR', NULL),
(3004, 'Lakshmi', 'B', 'Rao', 'Lakshmi B Rao', '2020-11-18', 68000, 'Ground Engineer', 'BLR', NULL),
(3005, 'Suresh', 'K', 'Pillai', 'Suresh K Pillai', '2020-12-22', 70000, 'Ground Engineer', 'BLR', NULL);

-- 4. Immigration Handlers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(4001, 'Meera', 'D', 'Khanna', 'Meera D Khanna', '2021-01-10', 55000, 'Immigration Handler', 'BLR', NULL),
(4002, 'Arun', 'L', 'Gupta', 'Arun L Gupta', '2021-02-14', 56000, 'Immigration Handler', 'BLR', NULL),
(4003, 'Divya', 'S', 'Menon', 'Divya S Menon', '2021-03-18', 54000, 'Immigration Handler', 'BLR', NULL),
(4004, 'Rohan', 'A', 'Joshi', 'Rohan A Joshi', '2021-04-22', 57000, 'Immigration Handler', 'BLR', NULL),
(4005, 'Kavya', 'R', 'Bhat', 'Kavya R Bhat', '2021-05-28', 55500, 'Immigration Handler', 'BLR', NULL);

-- 5. Security Handlers (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(5001, 'Arjun', 'M', 'Verma', 'Arjun M Verma', '2020-06-10', 50000, 'Security Handler', 'BLR', NULL),
(5002, 'Pooja', 'K', 'Saxena', 'Pooja K Saxena', '2020-07-15', 51000, 'Security Handler', 'BLR', NULL),
(5003, 'Rahul', 'T', 'Pandey', 'Rahul T Pandey', '2020-08-20', 49500, 'Security Handler', 'BLR', NULL),
(5004, 'Nisha', 'B', 'Shetty', 'Nisha B Shetty', '2020-09-25', 52000, 'Security Handler', 'BLR', NULL),
(5005, 'Manish', 'V', 'Shah', 'Manish V Shah', '2020-10-30', 50500, 'Security Handler', 'BLR', NULL);

-- 6. Retail Staff (5 employees, no password)
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(6001, 'Swati', 'P', 'Mehta', 'Swati P Mehta', '2022-01-15', 35000, 'Retail Staff', 'BLR', NULL),
(6002, 'Nikhil', 'R', 'Agarwal', 'Nikhil R Agarwal', '2022-02-20', 36000, 'Retail Staff', 'BLR', NULL),
(6003, 'Tanvi', 'S', 'Chopra', 'Tanvi S Chopra', '2022-03-10', 34500, 'Retail Staff', 'BLR', NULL),
(6004, 'Siddharth', 'K', 'Malhotra', 'Siddharth K Malhotra', '2022-04-18', 37000, 'Retail Staff', 'BLR', NULL),
(6005, 'Ritu', 'M', 'Kapoor', 'Ritu M Kapoor', '2022-05-22', 35500, 'Retail Staff', 'BLR', NULL);

-- Additional 20 pilots
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(7011, 'Ajinkya', 'S', 'Patil', 'Ajinkya S Patil', '2018-01-05', 185000, 'Pilot', 'BLR', NULL),
(7012, 'Melissa', 'K', 'Reed', 'Melissa K Reed', '2018-02-10', 188000, 'Pilot', 'BLR', NULL),
(7013, 'David', 'R', 'Brown', 'David R Brown', '2018-03-15', 179000, 'Pilot', 'BLR', NULL),
(7014, 'Sonia', 'L', 'Garcia', 'Sonia L Garcia', '2018-04-20', 190000, 'Pilot', 'BLR', NULL),
(7015, 'Michael', 'B', 'Wilson', 'Michael B Wilson', '2018-05-22', 192000, 'Pilot', 'BLR', NULL),
(7016, 'Jessica', 'Y', 'Taylor', 'Jessica Y Taylor', '2018-06-25', 180000, 'Pilot', 'BLR', NULL),
(7017, 'Robert', 'D', 'Martinez', 'Robert D Martinez', '2018-07-28', 187000, 'Pilot', 'BLR', NULL),
(7018, 'Emily', 'M', 'Anderson', 'Emily M Anderson', '2018-08-30', 181000, 'Pilot', 'BLR', NULL),
(7019, 'Brian', 'F', 'Thomas', 'Brian F Thomas', '2018-09-14', 183000, 'Pilot', 'BLR', NULL),
(7020, 'Lauren', 'E', 'Jackson', 'Lauren E Jackson', '2018-10-10', 186000, 'Pilot', 'BLR', NULL),
(7021, 'Anthony', 'J', 'White', 'Anthony J White', '2018-11-12', 184000, 'Pilot', 'BLR', NULL),
(7022, 'Nicole', 'S', 'Harris', 'Nicole S Harris', '2018-12-15', 185000, 'Pilot', 'BLR', NULL),
(7023, 'George', 'W', 'Martin', 'George W Martin', '2019-01-18', 182000, 'Pilot', 'BLR', NULL),
(7024, 'Rachel', 'C', 'Thompson', 'Rachel C Thompson', '2019-02-20', 179000, 'Pilot', 'BLR', NULL),
(7025, 'Eric', 'A', 'Garcia', 'Eric A Garcia', '2019-03-23', 188000, 'Pilot', 'BLR', NULL),
(7026, 'Megan', 'B', 'Martinez', 'Megan B Martinez', '2019-04-25', 189000, 'Pilot', 'BLR', NULL),
(7027, 'Kevin', 'R', 'Robinson', 'Kevin R Robinson', '2019-05-28', 180000, 'Pilot', 'BLR', NULL),
(7028, 'Samantha', 'L', 'Clark', 'Samantha L Clark', '2019-06-30', 183000, 'Pilot', 'BLR', NULL),
(7029, 'Jason', 'T', 'Rodriguez', 'Jason T Rodriguez', '2019-07-15', 181000, 'Pilot', 'BLR', NULL),
(7030, 'Angela', 'F', 'Lewis', 'Angela F Lewis', '2019-08-20', 186000, 'Pilot', 'BLR', NULL);


-- Additional 30 flight attendants
INSERT INTO Employee (Employee_ID, F_Name, M_Initial, L_Name, Employee_name, Hire_date, Employee_Salary, Job_title, Airport_ID, pwd) VALUES
(8011, 'Anna', 'M', 'Walker', 'Anna M Walker', '2022-01-01', 65000, 'Flight Attendant', 'BLR', NULL),
(8012, 'James', 'S', 'Hall', 'James S Hall', '2022-01-05', 63000, 'Flight Attendant', 'BLR', NULL),
(8013, 'Sara', 'T', 'Allen', 'Sara T Allen', '2022-01-10', 62000, 'Flight Attendant', 'BLR', NULL),
(8014, 'Mark', 'D', 'Young', 'Mark D Young', '2022-01-15', 64000, 'Flight Attendant', 'BLR', NULL),
(8015, 'Linda', 'K', 'Hernandez', 'Linda K Hernandez', '2022-01-20', 66000, 'Flight Attendant', 'BLR', NULL),
(8016, 'Steven', 'P', 'King', 'Steven P King', '2022-01-25', 63500, 'Flight Attendant', 'BLR', NULL),
(8017, 'Nancy', 'R', 'Wright', 'Nancy R Wright', '2022-01-30', 64000, 'Flight Attendant', 'BLR', NULL),
(8018, 'Paul', 'L', 'Lopez', 'Paul L Lopez', '2022-02-05', 62000, 'Flight Attendant', 'BLR', NULL),
(8019, 'Karen', 'M', 'Hill', 'Karen M Hill', '2022-02-10', 65000, 'Flight Attendant', 'BLR', NULL),
(8020, 'Daniel', 'J', 'Scott', 'Daniel J Scott', '2022-02-15', 63000, 'Flight Attendant', 'BLR', NULL),
(8021, 'Jessica', 'H', 'Green', 'Jessica H Green', '2022-02-20', 63500, 'Flight Attendant', 'BLR', NULL),
(8022, 'Donald', 'W', 'Adams', 'Donald W Adams', '2022-02-25', 64000, 'Flight Attendant', 'BLR', NULL),
(8023, 'Ashley', 'F', 'Baker', 'Ashley F Baker', '2022-03-01', 62000, 'Flight Attendant', 'BLR', NULL),
(8024, 'Brian', 'G', 'Nelson', 'Brian G Nelson', '2022-03-05', 65000, 'Flight Attendant', 'BLR', NULL),
(8025, 'Amber', 'C', 'Carter', 'Amber C Carter', '2022-03-10', 63000, 'Flight Attendant', 'BLR', NULL),
(8026, 'Eric', 'Q', 'Mitchell', 'Eric Q Mitchell', '2022-03-15', 62500, 'Flight Attendant', 'BLR', NULL),
(8027, 'Megan', 'V', 'Perez', 'Megan V Perez', '2022-03-20', 64000, 'Flight Attendant', 'BLR', NULL),
(8028, 'George', 'B', 'Roberts', 'George B Roberts', '2022-03-25', 64500, 'Flight Attendant', 'BLR', NULL),
(8029, 'Emily', 'M', 'Turner', 'Emily M Turner', '2022-03-30', 62000, 'Flight Attendant', 'BLR', NULL),
(8030, 'Samuel', 'N', 'Phillips', 'Samuel N Phillips', '2022-04-05', 63500, 'Flight Attendant', 'BLR', NULL),
(8031, 'Olivia', 'R', 'Campbell', 'Olivia R Campbell', '2022-04-10', 64000, 'Flight Attendant', 'BLR', NULL),
(8032, 'Jonathan', 'K', 'Parker', 'Jonathan K Parker', '2022-04-15', 63000, 'Flight Attendant', 'BLR', NULL),
(8033, 'Sophia', 'L', 'Evans', 'Sophia L Evans', '2022-04-20', 61000, 'Flight Attendant', 'BLR', NULL),
(8034, 'Andrew', 'T', 'Edwards', 'Andrew T Edwards', '2022-04-25', 62000, 'Flight Attendant', 'BLR', NULL),
(8035, 'Lauren', 'J', 'Collins', 'Lauren J Collins', '2022-04-30', 63000, 'Flight Attendant', 'BLR', NULL),
(8036, 'Brandon', 'M', 'Stewart', 'Brandon M Stewart', '2022-05-05', 64000, 'Flight Attendant', 'BLR', NULL),
(8037, 'Rachel', 'C', 'Sanchez', 'Rachel C Sanchez', '2022-05-10', 63500, 'Flight Attendant', 'BLR', NULL),
(8038, 'Justin', 'D', 'Morris', 'Justin D Morris', '2022-05-15', 62500, 'Flight Attendant', 'BLR', NULL),
(8039, 'Michelle', 'E', 'Rogers', 'Michelle E Rogers', '2022-05-20', 63000, 'Flight Attendant', 'BLR', NULL),
(8040, 'Benjamin', 'F', 'Reed', 'Benjamin F Reed', '2022-05-25', 62000, 'Flight Attendant', 'BLR', NULL);



-- Insert Sample Passengers
INSERT INTO Passenger (Passenger_ID, F_Name, M_Name, L_Name, Passenger_name, DOB, passport_no, Passenger_Address, Flight_no) VALUES
(2001, 'John', 'Michael', 'Doe', 'John Michael Doe', '1990-05-15', 'P1234567', '123 Main St, New York', '6E1862'),
(2002, 'Sarah', 'Jane', 'Smith', 'Sarah Jane Smith', '1985-08-22', 'P2345678', '456 Oak Ave, London', '6E1862'),
(2003, 'Rahul', 'Kumar', 'Verma', 'Rahul Kumar Verma', '1992-11-30', 'P3456789', '789 MG Road, Delhi', 'IX1345');

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



-- Insert Sample Baggage
INSERT INTO Baggage (Baggage_ID, Baggae_weight, Baggage_status, Passenger_ID, Flight_no) VALUES
(4001, 23.5, 'Checked In', 2001, '6E1862'),
(4002, 18.0, 'Checked In', 2002, '6E1862'),
(4003, 20.5, 'In Transit', 2003, 'IX1345');

-- Insert Sample Tickets
INSERT INTO Ticket (Ticket_no, Price, Seat_No, Booking_date, Flight_no, Passenger_ID) VALUES
('TKT001', 8500.00, '12A', '2024-10-01', '6E1862', 2001),
('TKT002', 9200.00, '12B', '2024-10-02', '6E1862', 2002),
('TKT003', 6800.00, '15C', '2024-10-03', 'IX1345', 2003);

-- Assign first 6 pilots to flights
UPDATE Crew SET Flight_no = '6E1862' WHERE Employee_ID IN (7011, 7012); -- 2 pilots to 6E1862
UPDATE Crew SET Flight_no = 'IX1345' WHERE Employee_ID IN (7013, 7014); -- 2 pilots to IX1345
UPDATE Crew SET Flight_no = '6E1234' WHERE Employee_ID IN (7015, 7016); -- 2 pilots to 6E1234

-- Assign 12 flight attendants evenly to those flights
-- 4 flight attendants per flight
UPDATE Crew SET Flight_no = '6E1862' WHERE Employee_ID IN (8011, 8012, 8013, 8014);
UPDATE Crew SET Flight_no = 'IX1345' WHERE Employee_ID IN (8015, 8016, 8017, 8018);
UPDATE Crew SET Flight_no = '6E1234' WHERE Employee_ID IN (8019, 8020, 8021, 8022);
