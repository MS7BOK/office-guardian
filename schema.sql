CREATE DATABASE IF NOT EXISTS employee_db;

USE employee_db;

-- Create a table for view options
CREATE TABLE view_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  option_name VARCHAR(50) NOT NULL
);

-- Insert view options
INSERT INTO view_options (option_name) VALUES
('View all departments'),
('View all roles'),
('View all employees');

-- Create departments table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  INDEX idx_name (name) -- Added index on name for potential search
);

-- Create roles table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL(12, 2) NOT NULL,
  department_id INT,
  INDEX idx_department_id (department_id), -- Added index on department_id for potential search
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT,
  manager_id INT,
  INDEX idx_role_id (role_id), -- Added index on role_id for potential search
  INDEX idx_manager_id (manager_id), -- Added index on manager_id for potential search
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Create a table for updating employee roles
CREATE TABLE employee_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  new_role_id INT,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (new_role_id) REFERENCES roles(id)
);
