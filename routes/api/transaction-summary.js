// Import node packages
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Import modules
const TransactionsModel = require('../../models/transactions');
const { getTransactionSummary, idNotProvided, buildSummaryPipeline, buildSummaryQuery } =
  require('../../controllers/transaction-summary');

module.exports = function () {
  router.get(
    '/transaction-summary/:member/:start/:end',
    getTransactionSummary({ buildSummaryPipeline, buildSummaryQuery, TransactionsModel, mongoose })
  );

  router.get(
    '/transaction-summary/:member',
    getTransactionSummary({ buildSummaryPipeline, buildSummaryQuery, TransactionsModel, mongoose })
  );

  router.get('/list-transactions', idNotProvided);

  return router;
};
