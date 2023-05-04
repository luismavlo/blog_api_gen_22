class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      console.log('cliente conectado');

      socket.on('new-post', (post) => {
        socket.broadcast.emit('render-new-post', post);
      });
    });
  }
}

module.exports = Sockets;
