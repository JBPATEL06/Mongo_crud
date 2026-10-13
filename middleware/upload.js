const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
 
    cb(null, req.body.email + path.extname(file.originalname));
  }
});
module.exports = multer({ storage });