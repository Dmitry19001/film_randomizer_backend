const Film = require('../models/film');
const { attachUsernames } = require('../helpers/filmHelpers');

exports.getFilms = async (req, res) => {
    try {
      let films = await Film.find();
      films = await attachUsernames(films);
      res.json(films);
    } catch (err) {
      res.status(500).send(err.message);
    }
};

exports.getFilm = async (req, res) => {
  try {
    let film = await Film.findById(req.params.id);
    
    const filmWithUsername = await attachUsernames(film);
    res.json(filmWithUsername[0]);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.createFilm = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(403).send("User not authenticated");
      }
  
      const filmData = {
        ...req.body,
        addedBy: req.user._id,
      };
  
      const film = new Film(filmData);
      await film.save();
  
      const filmWithUsername = await attachUsernames(film);
  
      res.status(201).json(filmWithUsername[0]);
    } catch (err) {
      res.status(400).send(err.message);
    }
};

exports.updateFilm = async (req, res) => {
    try {
      let film = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      const filmWithUsername = await attachUsernames(film);
      res.json(filmWithUsername[0]);
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
