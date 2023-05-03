const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const socketio = require('socket.io');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');
const http = require('http');
const Sockets = require('./sockets');

const authRouter = require('./routes/auth.routes');
const commentRouter = require('./routes/comment.routes');
const postRouter = require('./routes/post.routes');
const userRouter = require('./routes/user.routes');

const app = express();
// const server = http.createServer(app);

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in one hour!',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(hpp());

// const io = socketio(server, {
//   /*configuraciones adicionales*/
// });

// new Sockets(io);

app.use('/api/v1', limiter);

//rutas
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server! 🧨`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
