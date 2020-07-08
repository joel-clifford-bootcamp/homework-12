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
        'Update employee role',
        'Update employee manager',
    ]
};

module.exports = (con) => {

    inquirer.prompt(action).then(resp => {

        switch(action.choices.indexOf(resp.action))
        {
            case 0:
                db.viewEmployees(con);
        }
    });
}