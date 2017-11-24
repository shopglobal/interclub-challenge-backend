const express = require('express');

const router = express.Router();

const MemberModel = require('../../models/member');

module.exports = function () {
  router.get('/list-members', (req, res) => {
    MemberModel
      .find({})
      .sort({ number: 1 })
      .then(members => {
        const mappedMembers = members.map(member => {
          return {
            id: member._id,
            first_name: member.first_name,
            last_name: member.last_name,
            number: member.number,
          };
        });
        res.json(mappedMembers);
      })
      .catch(err => {
        res.status(400).send('Error');
      });
  });

  return router;
};
