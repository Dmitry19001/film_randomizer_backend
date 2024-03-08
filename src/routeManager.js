const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const genreRoutes = require('./routes/genres');
const categoryRoutes = require('./routes/categories');
const filmRoutes = require('./routes/films');

module.exports = (app) => {
    app.use('/api/login', loginRoute);
    app.use('/api/register', registerRoute);

    app.use('/api/genres', genreRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/films', filmRoutes);
};
