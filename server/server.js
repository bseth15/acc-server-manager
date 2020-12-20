const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const database = require('./config/database');
const passport = require('passport');

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to database
setTimeout(() => database.connect(), 1000);

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
app.use('/api/tracks', require('./routes/api/tracks'));
app.use('/api/car-models', require('./routes/api/carModels'));
app.use('/api/car-groups', require('./routes/api/carGroups'));
app.use('/api/driver-categories', require('./routes/api/driverCategories'));
app.use('/api/cup-categories', require('./routes/api/cupCategories'));
app.use('/api/session-types', require('./routes/api/sessionTypes'));

// Start server
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode listening on port ${PORT}...`)
);

process.on('SIGINT', () => shutdown('SIGINT'));

process.on('SIGTERM', () => shutdown('SIGTERM'));

process.once('SIGUSR2', () => shutdown('SIGUSR2'));

function shutdown(signal) {
  const types = {
    SIGINT: 'signal interrupt',
    SIGTERM: 'signal termination',
    SIGUSR2: 'nodemon restart',
  };
  console.log(`processing ${types[signal]}...`);
  server.close(error => {
    console.log(`server has stopped listening on port ${PORT}`);
    if (error) {
      console.error(error);
      process.exit(1);
    }
    database
      .disconnect()
      .then(() => console.log('server gracefully shutdown'))
      .then(() => {
        signal === 'SIGUSR2' ? process.kill(process.pid, 'SIGUSR2') : process.exit(0);
      });
  });
}
