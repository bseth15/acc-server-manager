module.exports = {
  mongoURI: 'mongodb://app:I2finit*1@localhost:27017/app',
  dbHost: 'localhost:27017',
  dbName: 'app',
  dbOptions: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  secret: 'f8857db6851ef0e454580b137f5d1929cf22ac8a0a044cfc87ce9f3127943884',
  authOptions: ['jwt', { session: false }],
};
