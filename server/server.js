const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const database = require('./config/database');
const passport = require('passport');

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to database
const admin = require('./config/admin-account');
setTimeout(() => database.connect().then(() => admin.initAdminAccount()), 1000);

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
app.use('/api/car-models', require('./routes/api/car-models'));
app.use('/api/car-groups', require('./routes/api/car-groups'));
app.use('/api/driver-categories', require('./routes/api/driver-categories'));
app.use('/api/cup-categories', require('./routes/api/cup-categories'));
app.use('/api/session-types', require('./routes/api/session-types'));

// Start server
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode listening on port ${PORT}...`)
);

// Gracefully shutdown server
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
