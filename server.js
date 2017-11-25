/* eslint-disable no-console */

// Import node packages
const express = require('express');
const cors = require('cors');

// Import modules
const { PORT, DATABASE_URL } = require('./config/env');
const connectToDatabase = require('./config/mongoose');
const { assignEndpointRoutersDynamicaly } = require('./helper');
const routers = require('./routes');

// Setup express instance
const app = express();

// Setup middlewares
app.set('port', PORT);
app.use(cors());

// Assign all api endpoints
assignEndpointRoutersDynamicaly(app, routers);

// Assign default endpoint to return 404
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Connect to MongoDB
connectToDatabase(DATABASE_URL);

// Start express server
app.listen(app.get('port'), () => {
  console.log(`Server listening on Port ${app.get('port')}`);
});
