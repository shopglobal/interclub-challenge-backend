const express = require('express');

const router = express.Router();


module.exports = function () {
  router.get('/aye', (req, res) => {
    const aye = 'aye';
    res.json({ aye });
  });

  return router;
};
