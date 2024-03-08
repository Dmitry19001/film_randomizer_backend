const Genre = require('../models/genre');

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).json(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.status(204).send("Genre deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
