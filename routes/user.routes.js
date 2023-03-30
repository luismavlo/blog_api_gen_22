const express = require('express');

//controllers
const userController = require('./../controllers/user.controller');

//middlewares
const userMiddleware = require('./../middlewares/user.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');

const router = express.Router();

router.get('/', userController.findAll);

router
  .route('/:id')
  .get(userMiddleware.validIfExistUser, userController.findOne)
  .patch(
    userMiddleware.validIfExistUser,
    validationMiddleware.updateUserValidation,
    userController.update
  )
  .delete(userMiddleware.validIfExistUser, userController.delete);

module.exports = router;
