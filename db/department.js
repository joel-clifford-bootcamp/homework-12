const inquirer = require("inquirer");
const prompts = require("../questions/department.json");

let departmentNames;

function validateDepartmentName(newName){
    if(newName.length === 0)
        return "Name is required";
    
    if(newName.length > 30)
        return "Name can't be longer than 30 characters"

    if(departmentNames.includes(newName))
        return `${newName} already exists`;

    return true;
}


module.exports = {
  
        viewDepartments: (con) =>{
            con.query("SELECT * FROM department", (err, result) =>{
                if (err)
                    console.log("Could not get list of departments");
                else
                    console.table(result);
            })
        },
        
        addDepartment: (con) => {
            con.query("SELECT * FROM department", (err, departments) => {
                if(err) 
                    console.log("Could not get list of departments")
                else{

                    departmentNames = departments.map(d => d.name);

                    prompts.add.validate = validateDepartmentName;

                    inquirer.prompt(prompts.add).then(resp => {
                        con.query("INSERT INTO department (name) VALUES (?)", [resp.name], (err, result) => {
                            if(err)
                                console.log("Could not create department");
                            else
                                console.log("Department created successfully");
                        });
                    });
                }
            });
        },
        
        removeDepartment: (con) => {
            con.query("SELECT * FROM department", (err, result) => {

                if(result.length === 0 )
                    console.log("Business in foreclosure");
                else{
                    prompts.remove.choices = result.map(r => r.name);

                    inquirer.prompt(prompts.remove).then(deptResp => {
                        prompts.layoff.message = `layoff everyone in ${deptResp.department}`;

                        inquirer.prompt(prompts.layoff).then(layoffResp => {
                            
                            if(layoffResp.confirm)
                                con.query(`DELETE FROM department WHERE name = ${deptResp.department}`, (err, deleteResult) => {
                                    if(err)
                                        console.log("Union challenging the firings");
                                    else
                                        console.log("Department dissolved");
                            });
                        })
                    });
                }
            });
        },
    
        viewDepartmentBudgets: (con) => {
            con.query("SELECT name AS 'Department', SUM(role_count * salary) AS 'Utilized Budget' FROM ( \
                (SELECT role_id, COUNT(id) AS role_count FROM employee GROUP BY role_id) as role_counts \
                LEFT JOIN  \
                role ON role_counts.role_id = role.id ) \
                JOIN department ON department_id = department.id \
                GROUP BY name", (err, result) => {
                    if (err)
                        console.log("unable to calculate budgets");
                    else
                        console.table(result);
                });
        }
}