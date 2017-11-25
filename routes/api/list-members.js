// Import node packages
const express = require('express');

const router = express.Router();

// Import modules
const MembersModel = require('../../models/members');

const { getMembersList } = require('../../controllers/list-members');

// Consign function export
module.exports = function () {
  router.get('/list-members', getMembersList(MembersModel));

  return router;
};
