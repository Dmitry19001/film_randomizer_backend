const express = require('express');
const router = express.Router();
const {
  getFilms,
  getFilm,
  createFilm,
  updateFilm,
  deleteFilm,
} = require('../controllers/filmsController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getFilms)
  .post(protect, createFilm);
router.route('/:id')
  .get(getFilm)
  .put(protect, updateFilm)
  .delete(protect, deleteFilm);

module.exports = router;
