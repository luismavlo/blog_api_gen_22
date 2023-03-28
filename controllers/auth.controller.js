const User = require('../models/user.model');

exports.signup = async (req, res, next) => {
  return res.status(201).json({
    status: 'success',
  });
};
