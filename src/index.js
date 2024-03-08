const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Route imports
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');

const app = express();

// Connect to Database
connectDB();

app.use(express.json());

// Use Routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
