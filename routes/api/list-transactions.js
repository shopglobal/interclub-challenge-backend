const express = require('express');

const router = express.Router();

const TransactionsModel = require('../../models/transactions');

const { getTransactionsList } = require('../../controllers/list-transactions');

module.exports = function () {
  router.get('/list-transactions', getTransactionsList(TransactionsModel));

  return router;
};
