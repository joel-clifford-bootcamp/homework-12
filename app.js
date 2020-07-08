const inquirer = require('inquirer')
const con = require("./db/con");
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
