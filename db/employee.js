module.exports = {
    viewEmployees: function (con){
        con.query("SELECT * FROM employee", (err, result) => {
            console.table(result);
        });
    }
}