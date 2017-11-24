const express = require('express');

const router = express.Router();

const MembersModel = require('../../models/member');

const { getMembersList } = require('../../controllers/list-members');

module.exports = function () {
  router.get('/list-members', getMembersList(MembersModel));

  return router;
};
