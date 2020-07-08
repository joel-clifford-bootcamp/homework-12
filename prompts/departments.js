const questions = require("../questions/department.json")
const db = require("../db/department");
const inquirer = require("inquirer");

const action = {
    name: 'action',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
        'View all departments',
        'Add a department',
        'Remove a department',
        'View a department\'s utilized budget'
    ]
};

module.exports = (con) => {

    inquirer.prompt(action).then(resp => {

        switch(action.choices.indexOf(resp.action))
        {
            case 0:
                db.viewDepartments(con);
                break;
            case 1:
                db.addDepartment(con);
                break;
            case 2:
                db.removeDepartment(con);
                break;
            case 3: 
                db.ViewDepartmentBudgets(con);
                break;
        }
    });
}