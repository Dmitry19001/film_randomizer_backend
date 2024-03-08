const Film = require('../models/film');

exports.getFilms = async (req, res) => {
  try {
    const films = await Film.find();
    res.json(films);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createFilms = async (req, res) => {
  try {
    const film = new Film(req.body);
    await film.save();
    res.status(201).json(film);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateFilm = async (req, res) => {
  try {
    const film = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(film);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteFilm = async (req, res) => {
  try {
    await Film.findByIdAndDelete(req.params.id);
    res.status(204).send("Film deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
