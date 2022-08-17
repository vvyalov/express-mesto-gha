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
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => { res.status(200).send(data); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Некорректные данные при создании карточки'));
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
        throw new AccessError('Нет прав на удаление карточки');
      }
      Card.findByIdAndRemove(cardId)
        .then(() => {
          res.send(card);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный _id карточки'));
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
      return res.send(card);
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
      return res.send('Указанный _id не найдена');
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
