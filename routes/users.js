const router = require('express').Router();
const { isObjectIdOrHexString } = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const {
  allUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const validationId = (value) => {
  if (isObjectIdOrHexString(value)) {
    return value;
  }
  throw new Error('Передан некорректный _id пользователя');
};

router.get('/', allUsers); // возвращает всех пользователей
router.get('/me', getCurrentUser); // возвращает текущего пользователя
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().custom(validationId),
    }),
  }),
  getUser,
); // возвращает пользователя по _id
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
); // обновляет профиль
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/?(([a-z\d\W_-]{2,})*([#]$)?)?/),
    }),
  }),
  updateAvatar,
); // обновляет аватар

module.exports = router;
