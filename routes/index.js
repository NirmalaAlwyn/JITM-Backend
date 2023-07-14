var express = require('express');
var router = express.Router();
var signin_controller = require('../controller/signin');
var pastvoicedrops_controller = require('../controller/past_voicedrops');
var vdcallerinfo_controller = require('../controller/vd_callerInfo');
var audiofile_controller = require('../controller/audiofiles_service');
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signin',signin_controller.reqforSignin);
router.post('/pastvoicedrops',pastvoicedrops_controller.reqforPastVoiceDrops);
router.post('/vdcallerdetails',vdcallerinfo_controller.reqforVoicedropCallInfo);
router.post('/audiofile',function(req,res,next) {  
    console.log(req.body);
    
    var accountId = req.body.accountId;
    var clientId  = req.body.clientId;
    var vdRefNo = req.body.vdRefNo;
    var audioFile = req.body.audioFile;

    const rootPath = "D:/NirmalaWorkingDirectory/";
    const filepath = accountId + "/"+ clientId + "/" + vdRefNo + "/";
    const audioPath = rootPath + filepath + audioFile;
    // const audioPath1 = path.join(rootPath, filepath, '2000.wav');
    // const audioPath = path.join(rootPath, filepath, '2000.wav');
    console.log('audioPath :'+audioPath)

    const audioPath2 = 'D:/NirmalaWorkingDirectory/VoiceDropListAndWaveFiles/2000.wav';
    console.log('audioPath2 :'+audioPath2)


    // getting the path for the audio file eg: "<rootDir>/voiceFile/jeeva.wav"
      // const audioPath1 = path.join('D:/NirmalaWorkingDirectory/VoiceDropListAndWaveFiles/2000.wav')
      // console.log('audioPath1 :'+audioPath1)
      // const audioPath = path.join('D:/NirmalaWorkingDirectory', 'VoiceDropListAndWaveFiles', '2000.wav');
      // console.log('audioPath :'+audioPath)
    // reading the audio file
      fs.readFile(audioPath2, (err, data) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        // setting the header for audio response
        res.setHeader('Content-Type', 'audio/wav');
        // sending the audio file length
        res.setHeader('Content-Length', data.length);


        // res.setHeader('responseType', 'arraybuffer');
        // const headers = { 'Content-Type': 'audio/wav',responseType: 'arraybuffer' };
        // sending the audio file
        res.send(data);
    });
  });

module.exports = router;
