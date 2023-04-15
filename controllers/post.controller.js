const Post = require('./../models/post.model');
const { db } = require('./../database/config');

const catchAsync = require('../utils/catchAsync');

exports.findAllPost = catchAsync(async (req, res, next) => {
  const { count, rows } = await Post.findAndCountAll({
    where: {
      status: 'active',
    },
  });

  return res.status(200).json({
    status: 'success',
    results: count,
    posts: rows,
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

  res.status(201).json({
    status: 'success',
    message: 'The post has been created',
    post,
  });
});

exports.findMyPosts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const query = `SELECT * FROM posts WHERE "userId" = ${sessionUser.id} AND status = 'active'`;

  const [rows, fields] = await db.query(query);

  res.status(200).json({
    status: 'success',
    results: fields.rowCount,
    posts: rows,
  });
});

exports.findUserPost = catchAsync(async (req, res, next) => {});

exports.findOnePost = catchAsync(async (req, res, next) => {});

exports.updatePost = catchAsync(async (req, res, next) => {});

exports.deletePost = catchAsync(async (req, res, next) => {});
