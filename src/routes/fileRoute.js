const controller = require('../controlleurs/fileController');
const uploadFiles = require('../middlewares/uploadFiles')
const uploadFile = require('../middlewares/uploadFile')
const authJwt = require('../middlewares/authJwt')

const www = process.env.WWW || './public';

module.exports = function(app) {
    app.get('/file-list',authJwt.getUserId, controller.getUserFiles)
    //app.post('/upload-file', uploadFile, controller.uploadFile)
    app.post('/upload-folder', uploadFiles, controller.uploadFolder)

    app.get('/upload', (req, res) => {
        res.sendFile(`upload.html`, { root: www });
    });
}