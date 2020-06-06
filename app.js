const inquirer = require('inquirer')
const mysql = require('mysql')

const action = [{
    name: 'action',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
        'View all employees',
        'View all employees by Department',
        'View all employees by Manager',
        'Add employee',
        'Remove employee',
        'Update employee role',
        'Update employee manager'
    ]
}];

// Holds valid department names and ids
let departments;
// Holds valid role names and ids
let roles;

// Set roles choices based on department selected
function getRolesChoices(answers){

    const rolesRows = con.query("SELECT id, title FROM role WHERE department_id = ?", [departments[answers.department]])

    if(rolesRows.length === 0) throw Error("No roles found in selected department");

    console.log(rolesRows)

    roles = Object.assign({}, ...rolesRows.map((row) => ({[row.title]: row.id})));

    return Object.keys(roles)
}

const employee = [{
    name: 'firstName',
    message: 'What is the employee\'s first name?',
    type: 'input'
},
{
    name: 'lastName',
    message: 'What is the employee\'s last name?',
    type: 'input'
},
{
    name: 'department',
    message: 'What is the employee\'s department?',
    type: 'list'
},
{
    name: 'role',
    message: 'What is the employee\'s role?',
    type: 'list',
    choices:getRolesChoices
}
]

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bootcamp",
    database:'employee_tracker'
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    inquirer.prompt(action).then(resp => {

        switch(action[0].choices.indexOf(resp.action)){
            case 0:
                viewEmployees()
                break
            case 1:
                viewEmployeesByDepartment()
                break
            case 2:
                viewEmployeesByManager()
                break
            case 3:
                addEmployee()
                break
            case 4:
                removeEmployee()
                break
            case 5:
                updateEmployeeRole()
                break
            case 6:
                updateEmployeeManger()
                break
        }
    })
  });


function viewEmployees(){
    con.query("SELECT * FROM employee", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
    });
}

function viewEmployeesByManager(){

}

function viewEmployeesByDepartment(){

}

function addEmployee(){
    con.query("SELECT * FROM department", (err, results, fields) => {
        if(err) throw err

        // Set choices for department
        departments = Object.assign({}, ...results.map((row) => ({[row.name]: row.id})));
        employee[2].choices = Object.keys(departments)

        inquirer.prompt(employee).then(resp => {
            const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?"
            const values  = [[resp.firstName, resp.lastName, resp]]
        })
    })
}

function updateEmployee(con){

}

function removeEmployee(con){

}

function updateEmployeeRole(con){

}

function updateEmployeeManger(con){

}
