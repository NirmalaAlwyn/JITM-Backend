exports.download_file = function(req,res,next) {
    try {
        var filename = req.body.report_filename;  
        console.log(req.body)      
        res.download(filename,function(err) {
            if(err) {
                console.log(JSON.stringify(err));
                next(err);
            }            
        })        
    }
    catch(error) {
        res.sendStatus(500);
    }
}