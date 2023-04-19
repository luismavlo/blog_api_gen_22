const express = require('express');

//controllerss
const commentController = require('../controllers/comment.controller');

//middlewares
const authMiddleware = require('./../middlewares/auth.middleware');
const commentMiddleware = require('./../middlewares/comment.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', commentController.findAllComments);

router.post('/:postId', commentController.createComment);

router
  .use('/:id', commentMiddleware.commentExist)
  .route('/:id')
  .get(commentController.findCommentById)
  .patch(
    validationMiddleware.validContentComment,
    commentController.updateComment
  )
  .delete(
    validationMiddleware.validContentComment,
    commentController.deleteComment
  );

module.exports = router;
