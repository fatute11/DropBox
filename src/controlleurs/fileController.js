const FileModel = require('../models/fileModel')
const FolderModel = require('../models/folderModel')
const UserModel = require('../models/userModel')
const authJwt = require('../middlewares/authJwt')


const FileController = {
    uploadFile: (req, res, err) => {
        if(err)
    console.log(req.file)
             
        // let user = authJwt.getUser();
        // console.log(typeof user._id);

        let newFile = new FileModel();

        newFile.title = req.file.originalname;
        newFile.mimeType = req.file.mimetype;
        newFile.size = req.file.size;
        newFile.path = req.file.path;
        newFile.owner = "5fd9d44c07ab7c197effbf67";
        // newFile.sharedWith = "5fad817859a3f34856217d9a";
        newFile.save()

        UserModel.findOneAndUpdate({_id: "5fd9d44c07ab7c197effbf67"}, {$push: {files: newFile._id}}).exec()

		res.end("File is uploaded");
    },
    uploadFolder: (req, res, err) => {
        if(err)
            console.log(err)

            //let user = authJwt.getUser();
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
                // newFile.owner = user._id;
                newFile.owner ="5fd9d44c07ab7c197effbf67";

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
                        newFolder.owner = "5fd9d44c07ab7c197effbf67";
                        // newFolder.subFolders = [];
                        newFolder.save();
                    }
                })
            }  
            // if (typeof newFile !== 'undefined') {
            // addFilesToFolder(folderPath, newFile)
            // }
            UserModel.findOneAndUpdate({_id: "5fd9d44c07ab7c197effbf67"}, {$push: {files: newFile._id}}).exec()

        });
		res.end("File is uploaded");
    },
    getUserFiles: async (req, res) => {
        let user = await FileModel.find({owner: "5fd9d44c07ab7c197effbf67"}).populate('files')
        // let user = await FileModel.find({owner: user._id}).populate('files')
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