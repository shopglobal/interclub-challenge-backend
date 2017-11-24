// Importe node packages
const consign = require('consign');
const path = require('path');
const fs = require('fs');

const ROOT_PATH = process.env.PWD;

const routeConsign = {};

const routerDirs = fs.readdirSync('./routes').filter(dir => dir !== 'index.js');

const con = consign({ cwd: path.join(ROOT_PATH, 'routes') });

routerDirs.forEach(dir => {
  con.include(dir);
});

con.into(routeConsign);


module.exports = routeConsign;
