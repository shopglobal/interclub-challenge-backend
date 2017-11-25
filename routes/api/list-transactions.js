// Import node packages
const express = require('express');

const router = express.Router();

// Import modules
const TransactionsModel = require('../../models/transactions');

const { getTransactionsList } = require('../../controllers/list-transactions');

// Consign function export
module.exports = function () {
  router.get('/list-transactions', getTransactionsList(TransactionsModel));

  return router;
};
