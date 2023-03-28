const authController = require('../controllers/auth.controller');
const express = require('express');

const router = express.Router();

router.post('/signup', authController.signup);

// signin

module.exports = router;
