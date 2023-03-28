const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());

//rutas
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
