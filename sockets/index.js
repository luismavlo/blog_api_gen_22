const postService = require('./../services/posts.service');

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      console.log('cliente conectado');

      socket.on('new-post', async ({ id }) => {
        try {
          const post = await postService.findPost(id);

          const newPost = await postService.downloadImgsPost(post);

          socket.broadcast.emit('render-new-post', newPost);
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
}

module.exports = Sockets;
