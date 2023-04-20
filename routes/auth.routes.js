const express = require('express');

//middlewares
const validations = require('./../middlewares/validations.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');
const { upload } = require('../utils/multer');

//controllers
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/signup',
  upload.single('profileImgUrl'),
  validations.createUserValidation,
  authController.signup
);

router.post('/login', validations.loginUserValidation, authController.login);

router.use(authMiddleware.protect);

router.get('/renew', authController.renew);

module.exports = router;
