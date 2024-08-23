const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const applyRoutes = require('./routeManager');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

// Apply routes
applyRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
