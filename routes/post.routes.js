const express = require('express');

//controllers
const postController = require('../controllers/post.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');
const userMiddleware = require('./../middlewares/user.middleware');
const postMiddleware = require('./../middlewares/post.middleware');

//utils
const { upload } = require('./../utils/multer');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(postController.findAllPost)
  .post(
    upload.array('postImgs', 3),
    validationsMiddleware.createPostValidation,
    postController.createPost
  );

router.get('/me', postController.findMyPosts);

router.get(
  '/profile/:id',
  userMiddleware.validIfExistUser,
  postController.findUserPost
);

router
  .route('/:id')
  .get(postMiddleware.existsPostForFoundIt, postController.findOnePost)
  .patch(
    validationsMiddleware.createPostValidation,
    postMiddleware.validIfExistPost,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(
    postMiddleware.validIfExistPost,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );

module.exports = router;
