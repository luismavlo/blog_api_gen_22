const express = require('express');

//controllers
const postController = require('../controllers/post.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(postController.createPost);

router.get('/me', postController.findMyPosts);

router.get('/profile/:id', postController.findUserPost);

router
  .route('/:id')
  .get(postController.findOnePost)
  .patch(authMiddleware.protectAccountOwner, postController.updatePost)
  .delete(authMiddleware.protectAccountOwner, postController.deletePost);

module.exports = router;
