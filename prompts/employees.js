const questions = require("../questions/employee.json")
const db = require("../db/employee");
const inquirer = require("inquirer");

const action = {
    name: 'action',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
        'View all employees',
        'Add employee',
        'Remove employee',
        'Update employee role and/or Manager',
    ]
};

module.exports = (con) => {

    inquirer.prompt(action).then(resp => {

        switch(action.choices.indexOf(resp.action))
        {
            case 0:
                db.viewEmployees(con);
                break;
            case 1: 
                db.addEmployee(con);
                break;
            case 2:
                db.removeEmployee(con);
                break;
            case 3:
                db.updateEmployeeRoleAndManager(con);
                break;
        }
    });
}