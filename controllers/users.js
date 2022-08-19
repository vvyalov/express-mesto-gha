const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RequestError = require('../errors/request-error');
const EmailError = require('../errors/email-error');
const NotFoundError = require('../errors/not-found-error');
const User = require('../models/user');

function allUsers(req, res, next) {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Указанный _id не найден'));
        return;
      }
      next(err);
    });
};

const newUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new EmailError('Пользователь с таким email уже существует'));
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Данные заполнены с ошибкой'));
        return;
      }
      if (err.code === 11000) {
        next(new EmailError('Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Указанный _id не найден'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Указанный _id не найден'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '62e90cd9d7cbfdc9705395ce', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ email: user.email });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userCurrentId = req.user._id;
  User.findById(userCurrentId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  allUsers,
  getUser,
  newUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
