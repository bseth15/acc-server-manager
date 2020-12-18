const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

const { MONGO_HOSTNAME, MONGO_DB, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = process.env;

const dbConnectionURL = {
  LOCAL: `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
  LOCALAUTH: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
};

mongoose
  .connect(dbConnectionURL.LOCALAUTH, options)
  .then(() => console.log(`[mongoose] connected to mongodb at ${MONGO_HOSTNAME}:${MONGO_PORT}`))
  .then(() => console.log(`[mongoose] using ${MONGO_DB} database`))
  .catch(error => console.log(`[mongoose] ${error}`));
