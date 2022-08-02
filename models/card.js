const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    // eslint-disable-next-line no-undef
    default: Data.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
