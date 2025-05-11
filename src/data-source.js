// data-source.js
require('reflect-metadata');
const { DataSource } = require('typeorm');

const Category   = require('./entities/Category');
const Genre      = require('./entities/Genre');
const User       = require('./entities/User');
const Film       = require('./entities/Film');
const FilmHub    = require('./entities/FilmHub');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  logging: false,
  entities: [ Category, Genre, User, Film, FilmHub ],
});

module.exports = AppDataSource;
