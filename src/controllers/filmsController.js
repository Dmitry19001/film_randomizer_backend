// controllers/filmsController.js
const asyncHandler = require('express-async-handler');
const { In, MoreThan } = require('typeorm');
const AppDataSource = require('../data-source');
const { attachUsernames } = require('../helpers/filmHelpers');

const filmRepo      = AppDataSource.getRepository('Film');
const genreRepo     = AppDataSource.getRepository('Genre');
const categoryRepo  = AppDataSource.getRepository('Category');

exports.getFilms = asyncHandler(async (req, res) => {
  const { showWatched } = req.query;

  let where = {};
  if (showWatched === 'true') {
    where.isWatched = MoreThan(0);
  } else if (showWatched === 'false') {
    where.isWatched = 0;
  }

  const films = await filmRepo.find({
    relations: ['genres', 'categories', 'addedBy'],
  });
  const withUsers = await attachUsernames(films);
  res.json(withUsers);
});

exports.getFilm = asyncHandler(async (req, res) => {
  const film = await filmRepo.findOne({
    where: { id: req.params.id },
    relations: ['genres', 'categories', 'addedBy'],
  });
  const [single] = await attachUsernames(film ? [film] : []);
  res.json(single);
});

exports.postFilm = asyncHandler(async (req, res) => {
  // ensure authenticated
  if (!req.user?.id) return res.status(403).send('User not authenticated');

  // lookup genres & categories by localizationId
  const genres = await genreRepo.find({
    where: { localizationId: In(req.body.genres || []) },
  });
  const categories = await categoryRepo.find({
    where: { localizationId: In(req.body.categories || []) },
  });

  const filmData = {
    title:      req.body.title,
    isWatched:  req.body.isWatched ?? false,
    imageUrl:   req.imageUrl || '',
    addedBy:    { id: req.user.id },
    genres:     genres.map(g => ({ id: g.id })),
    categories: categories.map(c => ({ id: c.id })),
  };

  let newFilm = filmRepo.create(filmData);
  newFilm = await filmRepo.save(newFilm);

  // reload with relations
  const saved = await filmRepo.findOne({
    where: { id: newFilm.id },
    relations: ['genres', 'categories', 'addedBy'],
  });
  const [out] = await attachUsernames(saved ? [saved] : []);
  res.status(201).json(out);
});

exports.updateFilm = asyncHandler(async (req, res) => {
  // lookup updated genres/categories
  const genres = await genreRepo.find({
    where: { localizationId: In(req.body.genres || []) },
  });
  const categories = await categoryRepo.find({
    where: { localizationId: In(req.body.categories || []) },
  });

  const updateData = {
    title:      req.body.title,
    isWatched:  req.body.isWatched,
    imageUrl:   req.imageUrl || '',
    genres:     genres.map(g => ({ id: g.id })),
    categories: categories.map(c => ({ id: c.id })),
  };

  await filmRepo.update(req.params.id, updateData);
  const updated = await filmRepo.findOne({
    where: { id: req.params.id },
    relations: ['genres', 'categories', 'addedBy'],
  });
  const [out] = await attachUsernames(updated ? [updated] : []);
  res.json(out);
});

exports.deleteFilm = asyncHandler(async (req, res) => {
  await filmRepo.delete(req.params.id);
  res.status(204).send('Film deleted');
});
