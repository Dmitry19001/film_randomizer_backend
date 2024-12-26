const mongoose = require('mongoose');

const filmHubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the room'],
  },
  room_password: {
    type: String,
    required: [true, 'Please add a room password'],
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  current_chosen_film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_modified: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FilmHub', filmHubSchema);
