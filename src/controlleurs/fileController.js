const FileModel = require('../models/fileModel')
const FolderModel = require('../models/folderModel')
const UserModel = require('../models/userModel')
const authJwt = require('../middlewares/authJwt')


const FileController = {
    uploadFile: (req, res, err) => {
        if(err)
             console.log(req.file)
             
        authJwt.verifyToken();
        let newFile = new FileModel();

        newFile.title = req.file.originalname;
        newFile.myme_type = req.file.mymetype;
        newFile.size = req.file.size;
        newFile.path = req.file.path;
        // newFile.owner = "5fb2d435b9994235b2ff3bb0";
        // newFile.sharedWith = "5fad817859a3f34856217d9a";
        newFile.save()

        // UserModel.findOneAndUpdate({_id: '5fb2d435b9994235b2ff3bb0'}, {$push: {files: newFile._id}}).exec()

		res.end("File is uploaded");
    },
    uploadFolder: (req, res, err) => {
        if(err)
            console.log(err)
        
        console.log(req.files)
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
                newFile.owner = "5fb5a204bd2d646fb84ad4f7";
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
                        newFolder.owner = "5fb5a204bd2d646fb84ad4f7";
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
        let user = await FileModel.find({owner: "5fb5a204bd2d646fb84ad4f7"}).populate('files')
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