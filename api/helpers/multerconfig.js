const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'tmp',
  filename: function (req, file, cb) {
    const fileExtention = path.parse(file.originalname).ext;
    cb(null, Date.now() + fileExtention);
  },
});

const upload = multer({ storage });

module.exports = upload;
