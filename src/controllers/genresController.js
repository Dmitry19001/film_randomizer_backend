// controllers/genresController.js
const asyncHandler = require('express-async-handler');
const AppDataSource = require('../data-source');

const genreRepo = AppDataSource.getRepository('Genre');

exports.getGenres = asyncHandler(async (req, res) => {
  const genres = await genreRepo.find();
  res.json(genres);
});

exports.getGenre = asyncHandler(async (req, res) => {
  const genre = await genreRepo.findOneBy({ id: req.params.id });
  res.json(genre);
});

exports.createGenre = asyncHandler(async (req, res) => {
  const g = genreRepo.create(req.body);
  const saved = await genreRepo.save(g);
  res.status(201).json(saved);
});

exports.updateGenre = asyncHandler(async (req, res) => {
  await genreRepo.update(req.params.id, req.body);
  const updated = await genreRepo.findOneBy({ id: req.params.id });
  res.json(updated);
});

exports.deleteGenre = asyncHandler(async (req, res) => {
  await genreRepo.delete(req.params.id);
  res.status(204).send('Genre deleted');
});
