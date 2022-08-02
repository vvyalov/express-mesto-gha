const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req, res) => {
  const { userID } = req.params;
  User.findById(userID)
    .then((user) => {
      if (user) { res.send(user); }
      return res.status(404).send({ message: 'Указанный _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный _id пользователя' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при создании пользователя' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Указанный _id не найден' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные пользователя' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Указанный _id не найден' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
