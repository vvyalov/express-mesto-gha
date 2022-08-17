const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const UserRouter = require('./routes/users');
const CardRouter = require('./routes/cards');
const { newUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

app.use(auth);
app.use(cookieParser);
app.use(bodyParser.json());
app.use('/', auth, UserRouter);
app.use('/', auth, CardRouter);
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send({ message: status === 500 ? 'Произошла ошибка' : message });
  next();
});
app.use(errors());

app.listen(PORT);
