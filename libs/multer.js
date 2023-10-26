const multer = require('multer');

module.exports = {
  imageStorage: multer({
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Incorrect file');
        error.code = 'INCORRECT_FILETYPE';
        return cb(error, false);
      }
      cb(null, true);
    },
    onError: (err, next) => {
      next(err);
    },
  }),
};
