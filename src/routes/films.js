const express = require('express');
const router = express.Router();
const {
  getFilms,
  getFilm,
  postFilm,
  updateFilm,
  deleteFilm,
} = require('../controllers/filmsController');
const protect  = require('../middleware/auth');

router.route('/')
  .get(getFilms)
  .post(protect, postFilm);
router.route('/:id')
  .get(getFilm)
  .put(protect, updateFilm)
  .delete(protect, deleteFilm);

module.exports = router;
