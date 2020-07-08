const inquirer = require('inquirer')
const con = require("./db/con");
const employees = require("./prompts/employees");
const departments = require("./prompts/departments");
const roles = require("./prompts/roles");

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
            departments(con);
            break;
        case "Roles":
            roles(con);
            break;
        case "Employees":
            employees(con);
            break;
        }
});
