const getAllDepartments = () => 'SELECT * FROM departments';
const getAllRoles = () => 'SELECT * FROM roles';
const getAllEmployees = () => 'SELECT * FROM employees';

const addDepartment = (departmentName) => `INSERT INTO departments (name) VALUES ('${departmentName}')`;

const addRole = (title, salary, departmentId) => `
  INSERT INTO roles (title, salary, department_id)
  VALUES ('${title}', ${salary}, ${departmentId})
`;

const addEmployee = (firstName, lastName, roleId, managerId) => `
  INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES ('${firstName}', '${lastName}', ${roleId}, ${managerId === null ? 'null' : `'${managerId}'`});
`;

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
};
