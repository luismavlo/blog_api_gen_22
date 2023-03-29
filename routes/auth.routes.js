const express = require('express');

//middlewares
const validations = require('./../middlewares/validations.middleware');

//controllers
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', validations.createUserValidation, authController.signup);

module.exports = router;
