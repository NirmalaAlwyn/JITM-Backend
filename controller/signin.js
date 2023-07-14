
const connection = require('../database_controller/db_connection');
// const connection = require('../database_controller/db_connection');

// const { rejects } = require('assert');
// const { resolve } = require('path');

exports.reqforSignin = async function(req,res) {
    try {
        console.log(req.body);
        var userName = req.body.emailId;
        var password = req.body.pasWord;

        const dbRecordCount = await checkLoginCredentials(userName,password);
        console.log('dbRecordCount'+dbRecordCount[0].NrofRecord);
        if(dbRecordCount[0].NrofRecord > 0) {
            const loginResult = await getLoginclientDetails(userName,password);
            if(loginResult != 0){
                const result = {
                    loginStatus : "valid",
                    accountId :loginResult[0].accountid,
                    accountname :"Door Sabha Nigam Limited",
                    clientId :loginResult[0].clientid,
                    clientName :loginResult[0].organization, 
                    emailId : userName
                    // userInfo : loginResult,
                }
                res.send(JSON.stringify(result));  
            }
            else {
                const result = {
                    loginStatus : "inValid",
                }
                res.send(JSON.stringify(result));
            }
        }
        else {
            const result = {
                loginStatus : "inValid",
            }
            res.send(JSON.stringify(result));
        }
    }
    catch (error) {
        const errorResult = {
            loginStatus : "Error",
            error : error.code,
        }
        res.send(JSON.stringify(errorResult));
    }  

}

getLoginclientDetails = (userName,password) => {
    return new Promise((resolve,reject) => {
        const loginQuery = "select accountid,clientid,organization from clients where emailid ='" +userName + "' AND client_status=1 AND client_password COLLATE latin1_general_cs = '" +password +"'"; 
        console.log(`loginQuery ${loginQuery}`);
            connection.query(loginQuery,(err,result) => {
            if(err) {
                return reject(err);
            }
            else {
                console.log("Result : "+JSON.stringify(result));                
                return resolve(result);
            }
        });
    }); //Promise
}

checkLoginCredentials = (userName,password) => {
    return new Promise((resolve,reject) => {
        const loginQuery = "select count(*) as NrofRecord from clients where emailid ='" +userName + "' AND client_status=1 AND client_password COLLATE latin1_general_cs = '" +password +"'"; 
        console.log(`loginQuery ${loginQuery}`);
            connection.query(loginQuery,(err,result) => {
            if(err) {
                return reject(err);
            }
            else {
                console.log("Result : "+JSON.stringify(result));                
                return resolve(result);
            }
        });
    }); //Promise
}