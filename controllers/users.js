const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RequestError = require('../errors/request-error');
const EmailError = require('../errors/email-error');
const NotFoundError = require('../errors/not-found-error');
const User = require('../models/user');

const jwtKey = '62e90cd9d7cbfdc9705395ce';

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
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
      }
      next(err);
    });
};

const newUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
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
            next(new RequestError('Данные заполнены с ошибкой или не переданы'));
            return;
          }
          if (err.code === 11000) {
            next(new EmailError('Пользователь с таким email уже существует'));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtKey, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ email: user.email });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userCurrentId = req.user._id;
  User.findById(userCurrentId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
      }
      next(err);
    });
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
