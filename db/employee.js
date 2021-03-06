const inquirer = require("inquirer");
const employeePrompts = require("../questions/employee.json");
const rolePrompts = require("../questions/role.json");


module.exports = {

    /**
     * 
     * @param {object} con mysql connection
     */
    viewEmployees: function (con){
        con.query("SELECT * FROM employee", (err, result) => {
            console.table(result);
        });
    },


    viewByRole: con => {
        con.query("SELECT * FROM role", async (err, roles) => {

            const roleNames = roles.map(r => r.title);
            rolePrompts.selectRole.choices = roleNames;

            const roleName = await inquirer.prompt(rolePrompts.selectRole)
            const roleId = roles.filter( r =>  r.title === roleName.role)[0].id;

            con.query("SELECT * FROM employee WHERE role_id = ?", [roleId], (err, result) =>{
                if(err)
                    console.log("Unable to retrieve employee list");
                else
                    console.table(result);
            })
        })
    },

    /**
     * Select a manager and view all of their underlings
     */
    viewByManager: con => {
        con.query("SELECT id, first_name, last_name FROM employee \
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
    },


    /**
     * Add a new emplyee
     * @param {object} con mysql connection 
     */
    addEmployee: function(con){
        con.query("SELECT * FROM department", async (err, departments) => {

            employeePrompts.employeeBasicInfo[2].choices = departments.map(d => d.name);
    
            const { firstName, lastName, department } = await inquirer.prompt(employeePrompts.employeeBasicInfo);
    
            const departmentId = departments.filter(d => d.name == department)[0].id;
    
            con.query(`SELECT * FROM role WHERE department_id = ${departmentId}`, async (err, roles) => {
                
                employeePrompts.employeeRole.choices = roles.map(r => r.title);
    
                const { role } = await inquirer.prompt(employeePrompts.employeeRole);
                
                const roleId = roles.filter(d => d.title == role)[0].id;
    
                con.query(`SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ${departmentId})`, async (err, managers) => {
    
                    let manager;
                    let managerId;
    
                    if(managers.length > 0)
                    {
                        const managersArray = managers.map(m => `${m.first_name} ${m.last_name}`);
                        managersArray.push("None");
    
                        employeePrompts.employeeManager.choices = managersArray;
    
                        manager = await inquirer.prompt(employeePrompts.employeeManager);
                        
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
    },
    
    /**
     * Remove an existing employee
     * @param {object} con mysql connection 
     */
    removeEmployee: function(con){

        con.query("SELECT * FROM employee", (err, employees) => {
            
            const employeeNames =  employees.map(e => `${e.id} - ${e.first_name} ${e.last_name}`);
            employeeNames.push("None");
    
            employeePrompts.employeeToRemove.choices = employeeNames;

            if(employees.length > 0) {
                inquirer.prompt(employeePrompts.employeeToRemove)
                    .then(resp => {
    
                    const employeeId = resp.employee == "None" ? null : employees[employeeNames.indexOf(resp.employee)].id;
    
                    if(resp.Name != "None"){
                        con.query(`DELETE FROM employee WHERE id = ${employeeId}`, (err, result) => {
                            if(err) throw err;
    
                            console.log(`Bye ${resp.employee.split(' ')[1]} :(`)
                        });
                    }
                });
            }
        });
    },

    updateEmployeeRoleAndManager: function(con) {

        con.query("SELECT * FROM role", (err, roles) => {

            const roleNames = roles.map(r => r.title);
            rolePrompts.selectRole.choices = roleNames;

            con.query("SELECT * FROM employee", (err, employees) => {
            
                const employeeNames =  employees.map(e => `${e.id} - ${e.first_name} ${e.last_name}`);
                employeePrompts.selectAnEmployee.choices = employeeNames;

                inquirer.prompt(employeePrompts.selectAnEmployee).then(async empResp => {

                    const employee = employees[employeeNames.indexOf(empResp.employee)];
                
                    const roleName = await inquirer.prompt(rolePrompts.selectRole)
                    const role = roles.filter( r =>  r.title === roleName.role)[0];

                    con.query(`SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ${role.department_id})`, async (err, managers) => {
    
                        let manager;
                        let managerId;
        
                        if(managers.length > 0)
                        {
                            const managersArray = managers.map(m => `${m.id} - ${m.first_name} ${m.last_name}`);
                            managersArray.push("None");
        
                            employeePrompts.employeeManager.choices = managersArray.filter(m => m.id != employee.id);
        
                            manager = await inquirer.prompt(employeePrompts.employeeManager);
                            
                            managerId = manager.manager == "None" ? null : managers[managersArray.indexOf(manager.manager)].id;

                            con.query("UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?", [role.id, managerId, employee.id], (err, result) => {
                                if(err)
                                    throw err;
                                
                                console.log(`${employee.first_name} ${employee.last_name}'s status updated successfully`)
                            });
                        }
                    });
                });
            });
        });
    }
}
