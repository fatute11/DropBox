const multer = require('multer')

const getFileName = (originalename) => {
  let splitOriginalename = originalename.split('/')
  return splitOriginalename[splitOriginalename.length -1]
}

const storage =	multer.diskStorage({
    destination: function (req, file, callback) {
    
      callback(null, './public/uploads');
    },
    filename: function (req, files, callback) {
      callback(null, getFileName(files.originalname));
    }
  });
  
  module.exports = multer({ storage : storage, preservePath: true}).array('files');