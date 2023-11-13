const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const Database = require('./db');
const {
    getAllDepartments,
    getAllRoles,
    getAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
} = require('./queries');

const db = new Database({
    host: 'localhost',
    user: 'root',
    password: 'Trovao12*',
    database: 'employee_db',
});

// Create MySQL connection
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Trovao12*',
    database: 'employee_db',
});

// Function to start the application
async function startApp() {
    try {
        await db.connect();

        let exitFlag = false;

        const [rows] = await db.query('SELECT DATABASE() AS db');

        if (rows && rows.length > 0 && rows[0].db) {
            console.log('Connected to MySQL database:', rows[0].db);
        } else {
            console.log('Unable to determine the connected database.');
        }
       
        while (!exitFlag) {
            const { choice } = await inquirer.prompt({
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            });

            switch (choice) {
                case 'View all departments':
                    const departments = await db.query(getAllDepartments());
                    console.table(departments);
                    break;

                case 'View all roles':
                    const roles = await db.query(getAllRoles());
                    console.table(roles);
                    break;

                case 'View all employees':
                    const employeesDetailsQuery = `
                            SELECT 
                                employees.id AS employee_id,
                                employees.first_name,
                                employees.last_name,
                                roles.title AS job_title,
                                departments.name AS department,
                                roles.salary,
                                CONCAT(managers.first_name, ' ', managers.last_name) AS manager
                            FROM employees
                            JOIN roles ON employees.role_id = roles.id
                            JOIN departments ON roles.department_id = departments.id
                            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                        `;
                    const employeesDetails = await db.query(employeesDetailsQuery);
                    console.table(employeesDetails);
                    break;

                case 'Add a department':
                    const departmentName = await inquirer.prompt({
                        type: 'input',
                        name: 'name',
                        message: 'Enter the name of the department:',
                    });
                    await db.query(addDepartment(departmentName.name));
                    console.log('Department added successfully!');
                    break;

                case 'Add a role':
                    const roleInput = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'Enter the title of the role:',
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter the salary for the role:',
                        },
                        {
                            type: 'input',
                            name: 'departmentId',
                            message: 'Enter the department ID for the role:',
                        },
                    ]);

                    if (isNaN(roleInput.salary) || isNaN(roleInput.departmentId)) {
                        console.log('Salary and department ID must be numeric.');
                    } else {
                        await db.query(addRole(roleInput.title, roleInput.salary, roleInput.departmentId));
                        console.log(`Role '${roleInput.title}' added successfully.`);
                    }
                    break;

                case 'Add an employee':
                    const employeeInput = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'Enter the first name of the employee:',
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'Enter the last name of the employee:',
                        },
                        {
                            type: 'input',
                            name: 'roleId',
                            message: 'Enter the role ID for the employee:',
                        },
                        {
                            type: 'input',
                            name: 'managerId',
                            message: 'Enter the manager ID for the employee (optional, press Enter to skip):',
                        },
                    ]);

                    // Validate if managerId is empty, convert it to null
                    const sanitizedManagerId = employeeInput.managerId.trim() === '' ? null : employeeInput.managerId;

                    await db.query(addEmployee(employeeInput.firstName, employeeInput.lastName, employeeInput.roleId, sanitizedManagerId));
                    console.log(`Employee '${employeeInput.firstName} ${employeeInput.lastName}' added successfully.`);
                    break;

                case 'Update an employee role':
                    try {
                        const employees = await db.query(getAllEmployees());
                        const employeeToUpdate = await inquirer.prompt({
                            type: 'list',
                            name: 'employeeId',
                            message: 'Select the employee you want to update:',
                            choices: employees.map(employee => ({
                                name: `${employee.first_name} ${employee.last_name}`,
                                value: employee.id,
                            })),
                        });

                        const roles = await db.query(getAllRoles());
                        const { roleId } = await inquirer.prompt({
                            type: 'list',
                            name: 'roleId',
                            message: 'Select the new role for the employee:',
                            choices: roles.map(role => ({
                                name: role.title,
                                value: role.id,
                            })),
                        });

                        await db.query(updateEmployeeRole(employeeToUpdate.employeeId, roleId));
                        console.log('Employee role updated successfully.');
                    } catch (error) {
                        console.error('Error updating employee role:', error);
                    }
                    break;

                case 'Exit':
                    console.log('Goodbye!');
                    exitFlag = true;
                    break;

                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await db.close();
        connection.end(); // Close MySQL connection
    }
}

// Connect to MySQL
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    startApp();
});
