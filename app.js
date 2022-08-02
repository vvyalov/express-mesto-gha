const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRouter = require('./routes/users');
const CardRouter = require('./routes/cards')

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62e7b6405025dd15b16f1e1a'
  };
  next()
})

app.use('/', UserRouter)
app.use('/', CardRouter)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})