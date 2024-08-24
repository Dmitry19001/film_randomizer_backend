const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the film'],
  },
  isWatched: {
    type: Boolean,
    default: false,
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Film', filmSchema);
