const router = require('express').Router();
const { isObjectIdOrHexString } = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const {
  getCards, newCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validation = (value) => {
  if (isObjectIdOrHexString(value)) {
    return value;
  }
  throw new Error('Некорректный _id карточки');
};

const validationId = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validation),
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
  celebrate(validationId),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate(validationId),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate(validationId),
  dislikeCard,
);

module.exports = router;
