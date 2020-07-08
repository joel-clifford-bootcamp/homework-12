module.exports = {
  
    viewEmployees: function(con){
    con
    .query("SELECT * FROM department", (err, departments, fields) => {

            const departmentNames = departments.map(d => d.name);

            inquirer.prompt( {
                name: 'department',
                message: 'Select department:',
                type: 'list',
                choices: departmentNames,

            }).then(resp => {
                
                const departmentId = departments[departmentNames.indexOf(resp.department)].id;
                
                con.query(`SELECT first_name, last_name \
                           FROM employee \
                           WHERE role_id IN ( \
                                SELECT id FROM role WHERE department_id = ${departmentId})`, 
                         (err, employees) => {

                    console.table(employees);
                });
            });
        });
    }
}