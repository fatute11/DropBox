const FileModel = require('../models/fileModel')
const FolderModel = require('../models/folderModel')
const UserModel = require('../models/userModel')
const authJwt = require('../middlewares/authJwt')
const uploadFile = require('../middleware/uploadFile')


const FileController = {
    uploadFile: (req, res, err) => {
        if(err)
             console.log(req.file)
             
        // let user = authJwt.getUser();
        // console.log(typeof user._id);

        let newFile = new FileModel();

        newFile.title = req.file.originalname;
        newFile.myme_type = req.file.mymetype;
        newFile.size = req.file.size;
        newFile.path = req.file.path;
        //newFile.owner = user._id;
        // newFile.sharedWith = "5fad817859a3f34856217d9a";
        newFile.save()

        UserModel.findOneAndUpdate({_id: user._id}, {$push: {files: newFile._id}}).exec()

		res.end("File is uploaded");
    },
    uploadFolder: (req, res, err) => {
        if(err)
            console.log(err)
        

        // console.log(req.files)
        //let user = authJwt.getUser();
        let arrPath = []
        req.files.forEach(file => {
            let splitPath = file.originalname.split('/')
            let fileName = splitPath[splitPath.length -1]
            
            // if (!fileName.startsWith(".")){
                let newFile = new FileModel();
                newFile.title = fileName;
                newFile.mimeType = file.mimetype;
                newFile.size = file.size;
                newFile.path = file.path;
                newFile.originalPath = file.originalname;
                // newFile.owner = user._id;

                // newFile.sharedWith = "5fad817859a3f34856217d9a";
                newFile.save()
            // }

            splitPath.pop()
            let folderPath = splitPath.join('/')
            let folderName = splitPath[splitPath.length -1]

            if(!arrPath.includes(folderPath)) {
                arrPath.push(folderPath)
                getFolderByPath(folderPath).then(folder => {
                    if (!folder) {
                        let newFolder = new FolderModel();
                        newFolder.name = folderName;
                        newFolder.path = folderPath
                        newFolder.owner = user._id;
                        // newFolder.subFolders = [];
                        newFolder.save();
                    }
                })
            }  
            // if (typeof newFile !== 'undefined') {
            // addFilesToFolder(folderPath, newFile)
            // }
        });
		res.end("File is uploaded");
    },
    getUserFiles: async (req, res) => {
        let user = await FileModel.find({owner: user._id}).populate('files')
        res.json(user)
    }
}

module.exports = FileController;

async function getFolderByPath(folderPath){
    return await FolderModel.findOne({path: folderPath}).exec();
}

async function addFilesToFolder(folderPath, newFile) {
    return await FolderModel.findOneAndUpdate({path: folderPath}, {$push: {files: addFilesToFolder(folderPath, newFile.id).id}}).exec();
}

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
  };


const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };
  
  module.exports = {
    uploadFile,
    getListFiles,
    download,
  };