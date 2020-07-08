DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE IF NOT EXISTS employee_tracker;

USE employee_tracker;

CREATE TABLE department (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    UNIQUE (name)
);

CREATE TABLE role (
	id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DOUBLE NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id),
    UNIQUE (title)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
)