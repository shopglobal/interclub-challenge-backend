/* eslint-disable no-console */

const mongoose = require('mongoose');

module.exports = function (url) {
  mongoose.Promise = Promise;
  mongoose.connect(url, { useMongoClient: true });

  mongoose.connection.on('connected', () => {
    console.log(`Database connected in ${url}`);
  });

  mongoose.connection.on('error', error => {
    console.log(`Erro in connection: ${error}`);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Database are closed');
      process.exit(0);
    });
  });
};
