const Post = require('../models/post.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: User,
      },
    ],
  });

  if (!post) {
    return next(new AppError(`Post with id: ${id} not found`, 404));
  }

  console.log(post);

  req.post = post;
  req.user = post.user;
  next();
});
