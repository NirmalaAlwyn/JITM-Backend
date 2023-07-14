const mysql = require('mysql')

const connection = mysql.createPool({
    connectionLimit:10,
    host : "192.168.0.66",
    user : 'root',
    password : 'abcd1234',
    database : 'voicedrop_provisioning'
});

module.exports = connection;