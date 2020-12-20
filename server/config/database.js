const mongoose = require('mongoose');

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: true,
};

function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_URI, mongoOptions)
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

function disconnect() {
  return mongoose.disconnect();
}

mongoose.connection.on('connected', () => {
  console.log(`connected to mongodb on host: ${mongoose.connection.host}`);
});

mongoose.connection.on('error', error => {
  console.log(`error connecting to mongodb: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected from mongodb');
});

module.exports = { connect, disconnect };
