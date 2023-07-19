var express = require('express');
var router = express.Router();
var signin_controller = require('../controller/signin');
var pastvoicedrops_controller = require('../controller/past_voicedrops');
var vdcallerinfo_controller = require('../controller/vd_callerInfo');
var download_controller = require('../controller/downloadfiles_service');
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/filedownload',download_controller.download_file);
router.post('/signin',signin_controller.reqforSignin);
router.post('/pastvoicedrops',pastvoicedrops_controller.reqforPastVoiceDrops);
router.post('/vdcallerdetails',vdcallerinfo_controller.reqforVoicedropCallInfo);
router.post('/audiofile',function(req,res,next) {  
    console.log(req.body);
    
    var accountId = req.body.accountId;
    var clientId  = req.body.clientId;
    var vdRefNo = req.body.vdRefNo;
    var audioFile = req.body.audioFile;

    //const rootPath = "D:/NirmalaWorkingDirectory/";
    // const rootPath = "/home/nirmala/VoiceDropRecordings/";
    const rootPath = process.env.RECORDING_ROOT_PATH;
    const filepath = accountId + "/"+ clientId + "/" + vdRefNo + "/";
    const audioPath = rootPath + filepath + audioFile + process.env.RECODING_FILE_EXT;

    // const audioPath = rootPath + filepath + audioFile + ".wav";
    // const audioPath = path.join(rootPath, filepath, '2000.wav');
    console.log('audioPath:: '+audioPath)

    // reading the audio file
      fs.readFile(audioPath, (err, data) => {
        if (err) {
            console.error("ERROR RESONSE SENT"+err);
            // res.send(err.code);

            res.sendStatus(500);
            return;
        }
        // setting the header for audio response
        res.setHeader('Content-Type', 'audio/wav');
        // sending the audio file length
        res.setHeader('Content-Length', data.length);

        // sending the audio file
        res.send(data);
    });
  });

module.exports = router;
