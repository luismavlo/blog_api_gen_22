const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    status: 'success',
    message: 'The user has been created succesfully!',
  });
});
