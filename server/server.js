const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to Database
require('./config/database')();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Initialize passport strategy
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', require('./routes/api/users'));

// Start server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
