const express = require('express');
const router = express.Router();
const {
  getGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers_mongo/genresController');

router.get('/', getGenres);
router.get('/:id', getGenre);
router.post('/', createGenre);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);

module.exports = router;
