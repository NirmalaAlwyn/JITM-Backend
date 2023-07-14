const mysql = require('mysql')
const connection = mysql.createPool({
    connectionLimit:10,
    host : "192.168.0.25",
    user : 'root',
    password : 'abcd1234',
    database : 'q100_cdr'
});

module.exports = connection;
