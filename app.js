const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const UserRouter = require('./routes/users');
const CardRouter = require('./routes/cards');
const { newUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required.email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/?(([a-z\d\W_-]{2,})*([#]$)?)?/),
      email: Joi.string().required.email(),
      password: Joi.string().required().min(8),
    }),
  }),
  newUser,
);

app.use(bodyParser.json());
app.use('/', UserRouter);
app.use('/', CardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.use(errors());

app.listen(PORT);
