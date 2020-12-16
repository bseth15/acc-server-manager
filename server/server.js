const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
mongoose
  .connect(config.mongoURI, config.dbOptions)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
