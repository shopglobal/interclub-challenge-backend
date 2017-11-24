const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const { api } = require('./routes');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/interclub-challenge', { useMongoClient: true });

app.use(cors());

Object.keys(api).forEach(endpoint => {
  const router = api[endpoint];
  app.use('/api', router);
});

app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on Port ${PORT}`);
});
