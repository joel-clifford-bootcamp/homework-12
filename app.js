const inquirer = require('inquirer')
const con = require("./con");


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
        'Update employee manager',
        'Add a department',
        'Add a role',
        'Exit'
    ]
}];


const employeeBasicInfo = [{
    name: 'firstName',
    message: 'What is the employee\'s first name?',
    type: 'input'
},
{
    name: 'lastName',
    message: 'What is the employee\'s last name?',
    type: 'input'
},
{    name: 'department',
     message: 'What is the employee\'s department?',
     type: 'list',
 }];

const employeeRole = {
    name: 'role',
    message: 'What is the employee\'s role?',
    type: 'list',
};

const employeeManager = {
    name: "manager",
    message: 'Who is the employee\'s Manager?',
    type: "list"
}


con.connect(async function(err) {
    if (err) throw err;

    let selectedAction;
    
    while(selectedAction != 'Exit' ){
        
        let resp = await inquirer.prompt(action);
        selectedAction = resp.action;

        switch(action[0].choices.indexOf(selectedAction)){
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
            case 7:
                addDepartment()
                break;
            case 8:
                addRole();
                break;
        }
    }
  });


function viewEmployees(){
    con.query("SELECT * FROM employee", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
    });
}

function viewEmployeesByManager(){
    con
    .query("SELECT id, first_name, last_name FROM employee \
            WHERE id IN ( \
                SELECT manager_id \
                FROM employee \
                GROUP BY manager_id \
                HAVING manager_id IS NOT NULL AND COUNT(id) > 0)",
        (err, managers, fields) => {

        if(managers.length === 0)
            console.log('No managers have been entered');
        else{
            const managerNames = managers.map(result => `${result.first_name} ${result.last_name}`);

            inquirer.prompt( {
                name: 'manager',
                message: 'Select manager:',
                type: 'list',
                choices: managerNames
            }).then(resp => {
                
                const managerId = managers[managerNames.indexOf(resp.manager)].id;
                
                con.query(`SELECT first_name, last_name FROM employee WHERE manager_id = ${managerId}`, (err, employees) => {

                    console.table(employees);
                });
            });
        }
    });
}

function viewEmployeesByDepartment(){
    con
    .query("SELECT * FROM department", (err, departments, fields) => {

            const departmentNames = departments.map(d => d.name);

            inquirer.prompt( {
                name: 'department',
                message: 'Select department:',
                type: 'list',
                choices: departmentNames,

            }).then(resp => {
                
                const departmentId = departments[departmentNames.indexOf(resp.department)].id;
                
                con.query(`SELECT first_name, last_name \
                           FROM employee \
                           WHERE role_id IN ( \
                                SELECT id FROM role WHERE department_id = ${departmentId})`, 
                         (err, employees) => {

                    console.table(employees);
                });
            });
        });
}

/**
 * Add a new employee
 */
function addEmployee(id = null){

    con.query("SELECT * FROM department", async (err, departments) => {

        employeeBasicInfo[2].choices = departments.map(d => d.name);

        const { firstName, lastName, department } = await inquirer.prompt(employeeBasicInfo);

        const departmentId = departments.filter(d => d.name == department)[0].id;

        con.query(`SELECT * FROM role WHERE department_id = ${departmentId}`, async (err, roles) => {
            
            employeeRole.choices = roles.map(r => r.title);

            const { role } = await inquirer.prompt(employeeRole);
            
            const roleId = roles.filter(d => d.title == role)[0].id;

            con.query(`SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ${departmentId})`, async (err, managers) => {

                let manager;
                let managerId;

                if(managers.length > 0)
                {
                    const managersArray = managers.map(m => `${m.first_name} ${m.last_name}`);
                    managersArray.push("None");

                    employeeManager.choices = managersArray;

                    manager = await inquirer.prompt(employeeManager);
                    
                    managerId = manager.manager == "None" ? null : managers[managersArray.indexOf(manager.manager)].id;
                }

                const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?"
                const values  = [[firstName, lastName, roleId, managerId]]
                
                con.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    console.log("Employee Added");
                  });
            });
        });
    });
}

/**
 * Remove and employee
 */
function removeEmployee(){
    con.query("SELECT * FROM employee", (err, employees) => {
        
        const employeeNames =  employees.map(e => `${e.first_name} ${e.last_name}`);
        employeeNames.push("None");

        if(employees.length > 0) {
            inquirer.prompt({
                name: "employee",
                message: "Which employee is getting the boot?",
                type: "list",
                choices: employeeNames
            }).then(resp => {

                const employeeId = resp.employee == "None" ? null : employees[employeeNames.indexOf(resp.employee)].id;

                if(resp.Name != "None"){
                    con.query(`DELETE FROM employee WHERE id = ${employeeId}`, (err, result) => {
                        if(err) throw err;

                        console.log(`Bye ${resp.employee.split(' ')[0]} :(`)
                    });
                }
            });
        }
    });
}


function updateEmployeeRole(con){

}

function updateEmployeeManger(con){

}
