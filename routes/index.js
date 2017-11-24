// Import node packages
const consign = require('consign');
const path = require('path');
const fs = require('fs');

// Ger rootpath from node precess
const ROOT_PATH = process.env.PWD;

// Define object to be inject with api routers
const routeConsign = {};

// Read all files insie /routes directory and filters out the index.js file
const routerDirs = fs.readdirSync('./routes').filter(dir => dir !== 'index.js');

// Start consign pipeline
const con = consign({ cwd: path.join(ROOT_PATH, 'routes') });

// Include each directory to consign instance
routerDirs.forEach(dir => {
  con.include(dir);
});

// Inject all directories into routers objects
con.into(routeConsign);

// Exports routers object
module.exports = routeConsign;
