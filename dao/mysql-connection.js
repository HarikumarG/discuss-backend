const mysql_connection = require('mysql');

//create connection for mysql
var connection = mysql_connection.createConnection({
    host: process.env.MYSQL_DATABASE_HOST,
    user: process.env.MYSQL_DATABASE_USER,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    multipleStatements: true
});

//connecting mysql
connection.connect((error) => {
    if(!error) {
        console.log("Mysql Database Connected Successfully");
    } else {
        console.log("Mysql Database Connection Failed");
    }
});

module.exports = connection;