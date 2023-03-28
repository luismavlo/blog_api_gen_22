const userController = require('../controllers/user.controller');
const express = require('express');

const router = express.Router();

router.get('/', userController.findAll);

router
  .route('/:id')
  .get(userController.findOne)
  .patch(userController.update)
  .delete(userController.delete);

module.exports = router;
