const router = require('express').Router();
const { updateProfile } = require('../controllers/profile.controller');
const { imageStorage } = require('../libs/multer');
const verivyToken = require('../middlewares/verivyToken');

router.put('/update', verivyToken, imageStorage.single('image'), updateProfile);

module.exports = router;
