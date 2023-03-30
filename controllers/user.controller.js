const User = require('../models/user.model');

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        status: 'active',
      },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
      error,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { user } = req;

    return res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
      error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { user } = req;

    await user.update({ name, email });

    return res.status(200).json({
      status: 'success',
      message: 'the user has been updated',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
      error,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { user } = req;

    await user.update({ status: 'disabled' });

    return res.status(200).json({
      status: 'success',
      message: 'the user has been deleted',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
      error,
    });
  }
};
