const db = require("../db/roles");
const inquirer = require("inquirer");

const action = {
    name: 'action',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
        'View all roles',
        'Add a role',
    ]
};

module.exports = (con) => {

    inquirer.prompt(action).then(resp => {

        switch(action.choices.indexOf(resp.action))
        {
            case 0:
                db.view(con);
                break;
            case 1:
                db.add(con);
                break;
        }
    });
}