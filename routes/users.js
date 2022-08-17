const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  allUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users', allUsers);
router.get('users/me', getCurrentUser);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/?(([a-z\d\W_-]{2,})*([#]$)?)?/),
    }),
  }),
  updateAvatar,
);

module.exports = router;
