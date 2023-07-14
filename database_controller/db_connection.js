const mysql = require('mysql')
const connection = mysql.createPool({
    connectionLimit:10,
    host : "192.168.0.16",
    user : 'root',
    password : 'abcd1234',
    database : 'v3_multilocation_central'
});

// const vddbconnection = mysql.createPool({
//     connectionLimit:10,
//     host : "192.168.0.66",
//     user : 'root',
//     password : 'abcd1234',
//     database : 'voicedrop_provisioning'
// });

// const cdrdbconnection = mysql.createPool({
//     connectionLimit:10,
//     host : "192.168.0.25",
//     user : 'root',
//     password : 'abcd1234',
//     database : 'q100_cdr'
// });



module.exports = connection;
// module.exports = vddbconnection;
// module.exports = cdrdbconnection;
//module.exports = centraldbconnection;