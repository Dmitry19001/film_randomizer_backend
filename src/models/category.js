const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  localizationId: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Category', categorySchema);
