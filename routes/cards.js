const router = require('express').Router();
const { isObjectIdOrHexString } = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const {
  getCards, newCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validationId = (value) => {
  if (isObjectIdOrHexString(value)) {
    return value;
  }
  throw new Error('Передан некорректный _id карточки');
};

const joiValidationId = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validationId),
  }),
};

router.get('/', getCards); // возвращает все карточки
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/(([a-z\d\W_-]{2,})*([#]$)?)?/),
    }),
  }),
  newCard,
); // создаёт карточку
router.delete(
  '/:cardId',
  celebrate(joiValidationId),
  deleteCard,
); // удаляет карточку
router.put(
  '/:cardId/likes',
  celebrate(joiValidationId),
  likeCard,
); // поставить лайк карточке
router.delete(
  '/:cardId/likes',
  celebrate(joiValidationId),
  dislikeCard,
); // убрать лайк с карточки

module.exports = router;
