const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const PostImg = db.define('postImg', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  postImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = PostImg;
