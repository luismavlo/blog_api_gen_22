const Comment = require('./comment.model');
const Post = require('./post.model');
const PostImg = require('./postImg.model');
const User = require('./user.model');

const initModel = () => {
  //1 User <-----> N Post
  User.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(User, { foreignKey: 'userId' });

  //1 User <-----> N Comment
  User.hasMany(Comment);
  Comment.belongsTo(User);

  //1 Post <----> N Comment
  Post.hasMany(Comment);
  Comment.belongsTo(Post);

  //1 Post <----> N PostImg
  Post.hasMany(PostImg);
  PostImg.belongsTo(Post);
};

module.exports = initModel;
