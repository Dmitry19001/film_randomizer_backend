const Film = require('../models/film');

exports.getFilms = async (req, res) => {
  try {
    const categories = await Film.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createFilms = async (req, res) => {
  try {
    const category = new Film(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateFilm = async (req, res) => {
  try {
    const category = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
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
