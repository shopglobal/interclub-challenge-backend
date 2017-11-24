// Importe node packages
const consign = require('consign');
const path = require('path');

const ROOT_PATH = process.env.PWD;

const routeConsign = {};


consign({ cwd: path.join(ROOT_PATH, 'routes') })
  .include('api')
  .into(routeConsign);


module.exports = routeConsign
