const Comment = require('./../models/comment.model');
const Post = require('./../models/post.model');
const PostImg = require('../models/postImg.model');
const User = require('../models/user.model');

const { db } = require('./../database/config');
const catchAsync = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const { ref, uploadBytes } = require('firebase/storage');

exports.findAllPost = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['userId', 'status'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl'],
      },
      {
        model: Comment,
        attributes: ['text', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['name', 'profileImgUrl'],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']], //ASC = ascendente; DESC = descendente
    limit: 10,
  });

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  const post = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });

  const postImgsPromises = req.files.map(async (file) => {
    const imgRef = ref(storage, `posts/${Date.now()}-${file.originalname}`);

    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return await PostImg.create({
      postId: post.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(postImgsPromises);

  res.status(201).json({
    status: 'success',
    message: 'The post has been created',
    post,
  });
});

exports.findMyPosts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const query = `SELECT * FROM posts WHERE "userId" = :idusuario AND status = :status`;

  const [rows, fields] = await db.query(query, {
    replacements: {
      idusuario: sessionUser.id,
      status: 'active',
    },
  });

  res.status(200).json({
    status: 'success',
    results: fields.rowCount,
    posts: rows,
  });
});

exports.findUserPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const posts = await Post.findAll({
    where: {
      userId: id,
      status: 'active',
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'passwordChangedAt'] },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.findOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  res.status(200).json({
    status: 'success',
    post,
  });
});

/* This code exports a function called `updatePost` that is used to update a post in the database. It
uses the `catchAsync` middleware to handle any errors that may occur during the execution of the
function. The function receives the `req`, `res`, and `next` parameters, and it extracts the
`title`, `content`, and `post` from the `req` object. Then, it updates the `post` object with the
new `title` and `content` values using the `update` method. Finally, it sends a JSON response with a
success status and a message indicating that the post has been updated. */
exports.updatePost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { post } = req;

  await post.update({ title, content });

  res.status(200).json({
    status: 'success',
    message: 'The post has been updated',
  });
});

/* This code exports a function called `deletePost` that is used to delete a post from the database. It
uses the `catchAsync` middleware to handle any errors that may occur during the execution of the
function. */
exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: 'disabled' });

  return res.status(200).json({
    status: 'success',
    message: 'The post has been deleted',
  });
});
