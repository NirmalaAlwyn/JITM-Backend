const connection = require('../database_controller/cdr_database');
const connection1 = require('../database_controller/vdprovisioningdb');


// const resultData = {
//     status : "",
//     NrofRecords : 0,
//     BookingRefNo :"",
//     clientId :"",
//     voicedropCallerInfo : "",
// }


exports.reqforVoicedropCallInfo = async function(req,res) {
    try {

        const resultData = {
            status : "",
            NrofRecords : 0,
            BookingRefNo :BookingRefNo,
            clientId :clientId,
            voicedropCallerInfo : [],
        }

        console.log(req.body);
        var accountId = req.body.accountId;
        var clientId  = req.body.clientId;
        var BookingRefNo  = req.body.booking_reference;

        // this.resultData.BookingRefNo = BookingRefNo;
        // this.resultData.clientId = clientId;
        
        const VoiceDropRefNos = await getVoiceDropRefNo(BookingRefNo,accountId,clientId);
        console.log('VoiceDropRefNos :'+VoiceDropRefNos)
        if(VoiceDropRefNos != 0){
            // var i = 0;
            for(let item of VoiceDropRefNos) {
                console.log('Item : '+item['voicedrop_reference']);
                var vdRefNo = item['voicedrop_reference'];
                // if(i == 0) {
                //     vdRefNo = 73269;
                //     i++;
                // }
                // else {
                //     vdRefNo = 73288;
                // }
                
                const voicedropCallercount = await getvoicedropCallCount(vdRefNo);                
                console.log('voicedropCallercount :'+JSON.stringify(voicedropCallercount[0].NrofRecord))
                if(voicedropCallercount[0].NrofRecord > 0) {
                    resultData.NrofRecords = resultData.NrofRecords + voicedropCallercount[0].NrofRecord;
                    console.log(resultData.NrofRecords);
                    const voicedropCallerData = await getvoicedropCallDetails(vdRefNo);
                    if(voicedropCallerData != 0){
                        //  const local = resultData.voicedropCallerInfo;
                        //  console.log('1--->'+JSON.stringify(local));
                       
                        var finalObj = resultData.voicedropCallerInfo.concat(voicedropCallerData);
                        console.log('PUSH------------'+JSON.stringify(finalObj));
                        resultData.voicedropCallerInfo = finalObj;
                        console.log('PUSH1------------'+JSON.stringify(resultData.voicedropCallerInfo));
                    }
                }
            }
            resultData.status = 'valid';
            res.send(JSON.stringify(resultData));
        }
        else {
            const result = {
                loginStatus : "inValid",
                reason :"noVDs",
            }
            res.send(JSON.stringify(result));
        }

        // const dbRecordCount = await getVoiceDropCallCount(vdRefNo);
        // console.log('dbRecordCount'+dbRecordCount[0].NrofRecord);
        // if(dbRecordCount[0].NrofRecord > 0) {
        //     const voicedropCallDetails = await getvoicedropCallDetails(vdRefNo);
        //     console.log('voicedropDetails :'+JSON.stringify(voicedropCallDetails));
        //     const result = {
        //         status : "valid",
        //         NrofRecords : dbRecordCount[0].NrofRecord,
        //         vdRefNo :vdRefNo,
        //         clientId :clientId,
        //         voicedropCallerInfo : voicedropCallDetails,
        //     }
        //     res.send(JSON.stringify(result));
        // }
        // else {
        //     const result = {
        //         status : "valid",
        //         NrofRecords : 0
        //     }
        //     res.send(JSON.stringify(result));
        // }
    }
    catch (error) {
        const errorResult = {
            status : "Error",
            error : error.code,
        }
        res.send(JSON.stringify(errorResult));
    }
    
}

getVoiceDropRefNo = (BookingRefNo,accountId,clientId) => {
    return new Promise((resolve,reject) => {
        const queryForVdref = "select voicedrop_reference from refnumber_association where account_id="+accountId+" and client_id="+clientId+" and booking_reference="+BookingRefNo;
        console.log(`loginQuery ${queryForVdref}`);
            connection1.query(queryForVdref,(err,result) => {
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


getvoicedropCallCount = (vdRefNo) => {
    return new Promise((resolve,reject) => {
        const CountQuery = "select count(*) as NrofRecord from ivrresponse where vdrefno =" +vdRefNo +" AND connecteduserphone=''"; 
        console.log(`CountQuery ${CountQuery}`);
        connection.query(CountQuery,(err,result) => {
            if(err) {
                return reject(err);
            }
            else {
                console.log("Result : "+JSON.stringify(result)); 
                console.log('from :'+result[0].NrofRecord)
                // console.log('local :'+this.resultData.NrofRecords)
                // this.resultData.NrofRecords = this.resultData.NrofRecords + result[0].NrofRecord;  
                // console.log(this.resultData.NrofRecords);          
                return resolve(result);
            }
        });
    }); //Promise
}

getvoicedropCallDetails = (vdRefNo) => {
    return new Promise((resolve,reject) => {
        const queryForVDcalldetails = "select vdrefno,calltype,phoneno,connectedcustcarephone,DATE_FORMAT(callconnectdate, '%H:%i:%S') AS callconnectdate,DATE_FORMAT(callstartdatetime,'%Y-%m-%d') AS callstartdate,DATE_FORMAT(callstartdatetime, '%H:%i:%S') AS callstarttime,DATE_FORMAT(disconnectdatetime,'%Y-%m-%d') AS disconnectdate,DATE_FORMAT(disconnectdatetime, '%H:%i:%S') AS disconnecttime from ivrresponse where vdrefno =" +vdRefNo +" AND connecteduserphone=''" ; 
        console.log(`queryForVDdetails ${queryForVDcalldetails}`);
        connection.query(queryForVDcalldetails,(err,result) => {
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