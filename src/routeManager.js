const authRoutes = require('./routes/authRoutes');
const genreRoutes = require('./routes/genres');
const categoryRoutes = require('./routes/categories');
const filmRoutes = require('./routes/films');

module.exports = (app) => {
    app.use('/api/', authRoutes);
    app.use('/api/genres', genreRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/films', filmRoutes);
};
