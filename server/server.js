const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users');

const config = require('./config/database');

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Connect to database
mongoose
  .connect(config.mongoURI, config.dbOptions)
  .then(() => console.log(`[server] connected to mongodb at ${config.dbHost}`))
  .then(() => console.log(`[server] using "${config.dbName}" database`))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/users', users);

// Start server
app.listen(port, () => {
  console.log(`[server] listening on port ${port}...`);
});
