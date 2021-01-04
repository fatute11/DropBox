const multer = require('multer')
//const maxSize = 2 * 1024 * 1024;

const storage =	multer.diskStorage({
    destination: function (req, file, callback) {

      callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {

      callback(null, file.originalname);
    }
  });
  
  module.exports = multer({ storage : storage, preservePath: true}).single('files');
  // module.exports = multer({
  //   storage: storage,
  //   limits: { fileSize: maxSize }
  // }) 