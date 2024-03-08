import express, { json } from 'express';
require('dotenv').config();
import mongoose from 'mongoose';
import connectDB from './config/database'; // Adjust the path as necessary

// Route imports
import loginRoute from './routes/login';
import registerRoute from './routes/register';

const app = express();

// Connect to Database
connectDB();

app.use(json());

// Use Routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
