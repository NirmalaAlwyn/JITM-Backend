exports.reqforVoicedropCallInfo =  function(req,res) {
    try {
        console.log(req.body);
        var accountId = req.body.accountId;
        var clientId  = req.body.clientId;
        var vdRefNo = req.body.vdRefNo;

        // D:\NirmalaWorkingDirectory\VoiceDropListAndWaveFiles
        // getting the path for the audio file eg: "<rootDir>/voiceFile/jeeva.wav"
        //  const audioPath1 = path.join('D:/NirmalaWorkingDirectory/VoiceDropListAndWaveFiles/2000.wav')
        //  console.log('audioPath1 :'+audioPath1)
        const rootPath = 'D:/NirmalaWorkingDirectory';
        const filepath = accountId + "/" + clientId + "/" + vdRefNo;
        // const audioPath = path.join('D:/NirmalaWorkingDirectory', 'VoiceDropListAndWaveFiles', '2000.wav');
        const audioPath = path.join(rootPath, filepath, '2000.wav');
        console.log('audioPath :'+audioPath)
        // reading the audio file
        fs.readFile(audioPath, (err, data) => {
            if (err) {
                console.error(err);
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
    }
    catch (error) {
        // const errorResult = {
        //     status : "Error",
        //     error : error.code,
        // }
        res.sendStatus(error.code);
    }
}