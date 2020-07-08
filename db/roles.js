const inquirer = require("inquirer");
const prompts = require("../questions/role.json");

let roles; 
let departments;
let selectedDepartmentId;

function validateTitle(input){

    if(input.length === 0)
        return "Title is required";

    if(input.length > 30)
        return "Title must be less than 30 characters";

    if(roles
        .filter(r => r.department_id === selectedDepartmentId)
        .map(r => r.title.trim().toLowerCase())
        .includes(input.trim().toLowerCase()))
        return `Department already contains a ${input.trim()} role`

    return true;
};

function validateSalary(input){

    if(isNaN(input))
        return("Salary must be numeric");

    const value = parseInt(input);

    if(value < 26880)
        return ("We comply with labour laws. Salary can't be below minimum wage.")

    return true;
};

module.exports = {
  
    view: (con) =>{
        con.query("SELECT * FROM role", (err, result) =>{
            if (err)
                console.log("Could not get list of roles");
            else
                console.table(result);
        })
    },

    add: (con) => {
        con.query("SELECT id, department_id, title FROM role", (err, role_rows) => {
            if(err)
                console.log("Could not communicate with database");
            else{
                roles = role_rows;

                con.query("SELECT * FROM department", async (err, department_rows) => {
                    if(err)
                        console.log("Could not communicate with database");
                    else{
                        departments = department_rows;
                        prompts.department.choices = departments.map(d => d.name);
                        prompts.add[0].validate = validateTitle;
                        prompts.add[1].validate = validateSalary;

                        const { department } = await inquirer.prompt(prompts.department);

                        selectedDepartmentId = departments.filter(d => d.name === department)[0].id;

                        const { title, salary } = await inquirer.prompt(prompts.add);

                        con.query("INSERT INTO role (title, salary, department_id) VALUE (?)", [[title, salary, selectedDepartmentId]], (err, result) => {
                            if (err)
                                console.log("Unable to add role");
                            else
                                console.log("Role created successfully");
                        });
                    }
                });
            }
        });
    }
}