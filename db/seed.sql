use employee_tracker;

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
	("Accountant",125000,2),
	("Lawyer",190000,3),
	("Legal Team Lead",250000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
	("Aleksandra", "Beach", 2, NULL),
	("Cathy", "Barlow", 4, NULL),
	("Adeeb", "Brennan", 7, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
	("Rose", "Mccray", 1, 1),
	("Lorcan", "Hubbard", 1, 1),
	("Soraya", "Iles", 1, 1),
	("Alyce", "Rooney", 1, 1),
	("Issac", "Lozano", 3, 6),
	("Nylah", "Vincent", 3, 2),
	("Rahim", "Rowe", 3, 2),
	("Kenzo", "Nelson", 3, 2),
	("Lidia", "Kidd", 5, 3),
	("Graham", "Torres", 5, 3),
	("Etta", "Hilton", 5, 3),
	("Aysha", "Ayers", 6, 3),
	("Gage", "Gross", 6, 3),
	("Eli", "Parker", 6, 3),
	("Israel", "Holmes", 3, 2),
	("Ellen", "Hanson", 3, 2),
	("Libby", "Mclaughlin", 3, 2)