const FileModel = require('../models/fileModel')
const FolderModel = require('../models/folderModel')
const UserModel = require('../models/userModel')
const authJwt = require('../middlewares/authJwt')
const uploadFile = require('../middleware/uploadFile')


const FileController = {
    // uploadFile: (req, res, err) => {
    //     if(err)
    // console.log(req.file)
             
    //     // let user = authJwt.getUser();
    //     // console.log(typeof user._id);

    //     let newFile = new FileModel();

    //     newFile.title = req.file.originalname;
    //     newFile.mimeType = req.file.mimetype;
    //     newFile.size = req.file.size;
    //     newFile.path = req.file.path;
    //     newFile.owner = "5fd9d44c07ab7c197effbf67";
    //     // newFile.sharedWith = "5fad817859a3f34856217d9a";
    //     newFile.save()

    //     UserModel.findOneAndUpdate({_id: "5fd9d44c07ab7c197effbf67"}, {$push: {files: newFile._id}}).exec()

	// 	res.end("File is uploaded");
    // },
    uploadFolder: (req, res, err) => {
        if(err)
            console.log(err)

        let user = req.body.user;
        let arrPath = []
        console.log(req.files)
        req.files.forEach(file => {
            let splitPath = file.path.split('/')
            let fileName = splitPath[splitPath.length -1]
            
            // if (!fileName.startsWith(".")){
                let newFile = new FileModel();
                newFile.title = fileName;
                newFile.mimeType = file.mimetype;
                newFile.size = file.size;
                newFile.path = file.path;
                newFile.originalPath = file.originalname;
                newFile.owner = user;

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
                        newFolder.owner = user;
                        // newFolder.subFolders = [];
                        newFolder.save();
                    }
                })
            }  
            // if (typeof newFile !== 'undefined') {
            // addFilesToFolder(folderPath, newFile)
            // }
            UserModel.findOneAndUpdate({_id: user}, {$push: {files: newFile._id}}).exec()

        });
		res.end("File is uploaded");
    },
    getUserFiles: async (req, res) => {
        let user = await FileModel.find({owner: req.userId}).populate('files').exec() 
        res.header(
            // "Access-Control-Allow-Headers",
            // "x-access-token, Origin, Content-Type, Accept",
            'Access-Control-Expose-Headers', 'Access-Control-Allow-Origin',
            'Access-Control-Allow-Origin', 'http://localhost:3000',
            'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Credentials', true
          );   
        res.json(user)
    },
    getFavoritesFiles: async (req, res) => {
        let user = await FileModel.find({owner: req.userId, isFavoris: true}).populate('files').exec() 
        res.header(
            // "Access-Control-Allow-Headers",
            // "x-access-token, Origin, Content-Type, Accept",
            'Access-Control-Expose-Headers', 'Access-Control-Allow-Origin',
            'Access-Control-Allow-Origin', 'http://localhost:3000',
            'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Credentials', true
          );   
        res.json(user)
    },
    addFavoritesFile: async (req, res) => {
        console.log(req.body.file._id)
        let data = (req.body.file.isFavoris === true) ? false : true        
        return await FileModel.findOneAndUpdate({_id: req.body.file._id}, {$set: {isFavoris: data}}).exec() 
        // res.header(
        //     // "Access-Control-Allow-Headers",
        //     // "x-access-token, Origin, Content-Type, Accept",
        //     'Access-Control-Expose-Headers', 'Access-Control-Allow-Origin',
        //     'Access-Control-Allow-Origin', 'http://localhost:3000',
        //     'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept',
        //     'Access-Control-Allow-Credentials', true
        //   );   
        // res.json(user)
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