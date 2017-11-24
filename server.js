const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const routers = require('./routes');
const { assignRouteDynamicaly } = require('./helper');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/interclub-challenge', { useMongoClient: true });

app.use(cors());

assignRouteDynamicaly(app, routers);

app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on Port ${PORT}`);
});
