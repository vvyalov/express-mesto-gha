const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRouter = require('./routes/users');
const CardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = { _id: '62e90cd9d7cbfdc9705395ce' };
  next();
});

app.use(bodyParser.json());
app.use('/', UserRouter);
app.use('/', CardRouter);

app.listen(PORT);
