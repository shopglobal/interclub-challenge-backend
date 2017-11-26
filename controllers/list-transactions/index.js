/* eslint-disable no-use-before-define */

/**
 * Function to get list of transactions from collection. Currying function data
 * needs the Members model as first argument in order to isolate the scope.
 * @param  {Object} TranscationsModel Model for Members collection
 * @return {Function}            function with endpoint callback signature
 */
function getTransactionsList (TranscationsModel) {
  if (!TranscationsModel) throw new Error('Transactions Model is missing');
  return async function (req, res) {
    // Get query params
    const { skip, limit, id, start, end } = req.query;

    let transactions;

    // Try to fetch transactions
    try {
      // Define transactions variable
      transactions =
        TranscationsModel.find(buildQuery({ start, end, id })).sort({ date: -1 });

      if (skip) transactions = transactions.skip(parseInt(skip, 10));
      if (limit) transactions = transactions.limit(parseInt(limit, 10));

      transactions = await transactions;
    } catch (fetchTranscationsError) {
      return res.status(400).send(`Error: ${fetchTranscationsError.message}`);
    }

    const mappedTransactions = transactions.map(transaction => {
      return {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        member: transaction.member,
        date: transaction.date,
      };
    });

    return res.json(mappedTransactions);
  };
}

function buildQuery ({ id, start, end }) {
  const query = [];

  if (start && end) {
    query.push({ date: { $gte: new Date(start) } });
    query.push({ date: { $lte: new Date(end) } });
  }

  if (id) query.push({ member: id });

  return {
    $and: query,
  };
}

module.exports = {
  getTransactionsList,
};
