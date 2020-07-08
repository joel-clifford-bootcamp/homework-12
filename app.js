const inquirer = require('inquirer')
const con = require("./con");
const employees = require("./prompts/employees");

const action = {
    name: 'action',
    message: 'What would you like to manage',
    type: 'list',
    choices: ['Departments', 'Roles', 'Employees', 'Nothing (Exit)']
}

con.connect(async function(err) {
    if (err) throw err;

        const resp = await inquirer.prompt(action);
        selectedAction = resp.action;
 
        switch(selectedAction){
            case "Departments":
                break;
            case "Roles":
                break;
            case "Employees":
                await employees(con);
                break;
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
