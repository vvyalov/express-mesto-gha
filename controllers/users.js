const bcrypt = require('bcrypt');
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
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((data) => {
          res.status(200).send({
            name: data.name,
            about: data.about,
            avatar: data.avatar,
            email: data.email,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Данные заполнены неверно');
      } else if (err.code === 11000) {
        throw new EmailError('Пользователь с таким адресом уже существует');
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const jwtKey = '62e90cd9d7cbfdc9705395ce';
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
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Данные заполнены неверно');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Указанный _id не найден');
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Указанный _id не найден');
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
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Данные заполнены неверно');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Указанный _id не найден');
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
