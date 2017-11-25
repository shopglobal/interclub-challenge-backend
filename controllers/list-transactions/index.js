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
    const { sort, skip, limit } = req.params;

    // Define transactions variable
    let transactions = TranscationsModel.find({});

    if (sort) transactions = transactions.sort(JSON.parse(sort));
    if (skip) transactions = transactions.skip(parseInt(skip, 10));
    if (limit) transactions = transactions.limit(parseInt(limit, 10));

    // Try to fetch transactions
    try {
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
      };
    });

    return res.json(mappedTransactions);
  };
}

module.exports = {
  getTransactionsList,
};
