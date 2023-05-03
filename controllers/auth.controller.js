const User = require('../models/user.model');

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('./../utils/firebase');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role, description } = req.body;

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    description,
    role,
    profileImgUrl: imgUploaded.metadata.fullPath,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'The user has been created succesfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //1 traernos la informacion de la req.body
  const { email, password } = req.body;

  //2. buscar el usuario y revisar si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }

  //3 validar si la contraseña es correcta

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //4. generar el jsonwebtoken
  const token = await generateJWT(user.id);

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  //5 enviar la respuesta al cliente
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
  });
});

exports.updatedPassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });

  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully!',
  });
});

exports.renew = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const imgRef = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRef);

  const tokenPromise = generateJWT(user.id);

  const [url, token] = await Promise.all([urlPromise, tokenPromise]);

  return res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
  });
});
