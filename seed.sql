
USE employee_tracker;

INSERT INTO department (name) 
VALUES 
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("Sales");
    
INSERT INTO role (title, salary, department_id)
VALUES
	("Salesperson",80000,4),
	("Sales Lead",100000,4),
	("Software Engineer",150000,1),
	("Lead Engineer",120000,1),
	("Accountant",125000,1),
	("Lawyer",190000,3),
	("Legal Team Lead",250000,3);