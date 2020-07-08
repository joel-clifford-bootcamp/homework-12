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

    
}


function updateEmployeeRole(con){

}

function updateEmployeeManger(con){

}
