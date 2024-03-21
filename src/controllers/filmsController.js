const Film = require('../models/film');
const Genre = require('../models/genre');
const Category = require('../models/category');
const { attachUsernames } = require('../helpers/filmHelpers');

const getFilms = async (req, res) => {
    try {
      let films = await Film.find().populate('genres categories');
      films = await attachUsernames(films);
      res.json(films);
    } catch (err) {
      res.status(500).send(err.message);
    }
};

const getFilm = async (req, res) => {
  try {
    let film = await Film.findById(req.params.id).populate('genres categories');
    
    const filmWithUsername = await attachUsernames(film);
    res.json(filmWithUsername[0]);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const createFilm = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(403).send("User not authenticated");
      }

      const genres = await Genre.find({
        localizationId: { $in: req.body.genres }
      });
      const categories = await Category.find({
        localizationId: { $in: req.body.categories }
      });
  
      const filmData = {
        ...req.body,
        addedBy: req.user._id,
        genres: genres.map(genre => genre._id),
        categories: categories.map(category => category._id),
      };
  
      const film = new Film(filmData);
      await film.save();
  
      film = await Film.findById(film._id).populate('genres categories');
      const filmWithUsername = await attachUsernames(film);
  
      res.status(201).json(filmWithUsername[0]);
    } catch (err) {
      res.status(400).send(err.message);
    }
};

const updateFilm = async (req, res) => {
    try {
      
      const genres = await Genre.find({
        localizationId: { $in: req.body.genres }
      });
      const categories = await Category.find({
        localizationId: { $in: req.body.categories }
      });
      
      const updateData = {
        ...req.body,
        genres: genres.map(genre => genre._id),
        categories: categories.map(category => category._id),
      };

      let film = await Film.findByIdAndUpdate(req.params.id, updateData, { new: true });
      
      film = await Film.findById(req.params.id).populate('genres categories');
      const filmWithUsername = await attachUsernames(film);
      res.json(filmWithUsername[0]);
    } catch (err) {
      res.status(400).send(err.message);
    }
};
  
const deleteFilm = async (req, res) => {
    try {
        await Film.findByIdAndDelete(req.params.id);
        res.status(204).send("Film deleted");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
  getFilms,
  getFilm,
  createFilm,
  updateFilm,
  deleteFilm
}