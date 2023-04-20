const Comment = require('./../models/comment.model');

const catchAsync = require('../utils/catchAsync');

/* This code exports a function named `findAllComments` that retrieves all comments with a status of
"active" from the database using the `Comment` model and sends them as a JSON response with a
success status code of 200. The function is wrapped in the `catchAsync` function to handle any
errors that may occur during the asynchronous operation. */
exports.findAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      status: 'active',
    },
  });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    comments,
  });
});

/* This code exports a function named `createComment` that creates a new comment in the database using
the `Comment` model. The function retrieves the `text` from the request body, the `postId` from the
request parameters, and the `sessionUser` from the request object. It then creates a new comment
with the retrieved data and sends a JSON response with a success status code of 201 and the created
comment. The function is wrapped in the `catchAsync` function to handle any errors that may occur
during the asynchronous operation. */
exports.createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const { sessionUser } = req;

  const comment = await Comment.create({
    text,
    postId,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'The comment has been created',
    comment,
  });
});

/* This code exports a function named `findCommentById` that retrieves a single comment from the
database using the `Comment` model and sends it as a JSON response with a success status code of
200. The function retrieves the `comment` object from the request object, which is populated by the
middleware function `getCommentById`. The `comment` object contains the comment data that was
retrieved from the database by the middleware function. The function is wrapped in the `catchAsync`
function to handle any errors that may occur during the asynchronous operation. */
exports.findCommentById = catchAsync(async (req, res, next) => {
  const { comment } = req;

  res.status(200).json({
    status: 'success',
    comment,
  });
});

/* This code exports a function named `updateComment` that updates an existing comment in the database
using the `Comment` model. The function retrieves the `text` from the request body and the `comment`
object from the request object, which is populated by the middleware function `getCommentById`. The
function then updates the `text` property of the `comment` object with the retrieved `text` and
sends a JSON response with a success status code of 200 and the updated comment. The function is
wrapped in the `catchAsync` function to handle any errors that may occur during the asynchronous
operation. */
exports.updateComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { comment } = req;

  await comment.update({ text });

  res.status(200).json({
    status: 'success',
    message: 'The comment has been updated',
    comment,
  });
});

/* This code exports a function named `deleteComment` that updates the status of an existing comment in
the database to "disabled" using the `Comment` model. The function retrieves the `comment` object
from the request object, which is populated by the middleware function `getCommentById`. The
function then updates the `status` property of the `comment` object to "disabled" and sends a JSON
response with a success status code of 200 and the updated comment. The function is wrapped in the
`catchAsync` function to handle any errors that may occur during the asynchronous operation. */
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: 'The comment has been deleted',
    comment,
  });
});
