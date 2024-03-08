const express = require('express');
const connectDB = require('./database');

require('dotenv').config();

const app = express();
const port = 3000;

connectDB();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
