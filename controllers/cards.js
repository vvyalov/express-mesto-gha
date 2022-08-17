const Card = require('../models/card');
const RequestError = require('../errors/request-error');
const NotFoundError = require('../errors/not-found-error');
const AccessError = require('../errors/access-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const newCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Указанный _id не найден');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new AccessError('У пользователя нет прав на удаление карточки');
      }
      Card.findByIdAndRemove(card._id)
        .then(() => {
          res.send(card);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Передан некорректный _id'));
        return;
      }
      next(err);
    });
}

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный _id карточки'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Указанный _id не найден');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный _id карточки'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  newCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
