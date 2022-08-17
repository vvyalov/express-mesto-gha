const router = require('express').Router();
const { isObjectIdOrHexString } = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const {
  getCards, newCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validate = (value) => {
  if (isObjectIdOrHexString(value)) {
    return value;
  }
  throw new Error('Некорректный _id карточки');
};

const validateId = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validate),
  }),
};

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/(([a-z\d\W_-]{2,})*([#]$)?)?/),
    }),
  }),
  newCard,
);

router.delete(
  '/:cardId',
  celebrate(validateId),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate(validateId),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate(validateId),
  dislikeCard,
);

module.exports = router;
