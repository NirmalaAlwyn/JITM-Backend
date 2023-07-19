const connection = require('../database_controller/vdprovisioningdb');


exports.reqforPastVoiceDrops = async function(req,res) {
    try {
        console.log(req.body);
        var accountId = req.body.accountId;
        var clientId  = req.body.clientId;

        const dbRecordCount = await getPastVoiceDropCount(accountId,clientId);
        console.log('dbRecordCount'+dbRecordCount[0].NrofRecord);
        if(dbRecordCount[0].NrofRecord > 0) {
            const voicedropDetails = await getpastvoicedropDetails(accountId,clientId);
            console.log('voicedropDetails :'+JSON.stringify(voicedropDetails));
            const result = {
                status : "valid",
                NrofRecords : dbRecordCount[0].NrofRecord,
                accountId :accountId,
                clientId :clientId,
                voicedropInfo : voicedropDetails,
            }
            res.send(JSON.stringify(result));
        }
        else {
            const result = {
                status : "valid",
                NrofRecords : 0
            }
            res.send(JSON.stringify(result));
        }
    }
    catch (error) {
        const errorResult = {
            status : "Error",
            error : error.code,
        }
        res.send(JSON.stringify(errorResult));
    }
    
}

getPastVoiceDropCount = (accountId,clientId) => {
    return new Promise((resolve,reject) => {
        const CountQuery = "select count(*) as NrofRecord from voicedrop where account_id =" +accountId+" and client_id="+clientId+ " AND (start_date < CURDATE() or (start_date=CURDATE() and booking_status= 3 ))" ; 
        console.log(`CountQuery ${CountQuery}`);
        connection.query(CountQuery,(err,result) => {
            if(err) {
                console.log(JSON.stringify(err));
                return reject(err);
            }
            else {
                console.log("Result : "+JSON.stringify(result));                
                return resolve(result);
            }
        });
    }); //Promise
}

getpastvoicedropDetails = (accountId,clientId) => {
    return new Promise((resolve,reject) => {
        const queryForVDdetails = "select booking_reference,voicedrop_name,DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,start_time,listsize,msgduration,dnd,redial_count,list_name,voice_file,report_file from voicedrop where account_id="+accountId+" and client_id="+clientId+" and (start_date < CURDATE() or (start_date=CURDATE() and booking_status=3))";
        console.log(`queryForVDdetails ${queryForVDdetails}`);
        connection.query(queryForVDdetails,(err,result) => {
            if(err) {
                console.log(JSON.stringify(err));
                return reject(err);
            }
            else {
                console.log("Result : "+JSON.stringify(result));                
                return resolve(result);
            }
        });
    }); //Promise
}