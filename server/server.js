const cors = require('cors');
const express = require('express');
const passport = require('passport');

const users = require('./src/routes/api/users');

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./src/config/passport')(passport);

// Use Routes
app.use('/api/users', users);

// Start Database
require('./src/config/database');

// Start server
app.listen(port, () => {
  console.log(`[express] listening on port ${port}...`);
});
