/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

/**
 * Function to get member details. Currying function data needs
 * the Members model as first argument in order to isolate the scope.
 * @param  {Object} MembersModel Model for Members collection
 * @return {Function}            function with endpoint callback signature
 */
function getTransactionSummary ({
  buildSummaryPipeline,
  buildSummaryQuery,
  TransactionsModel,
  mongoose,
}) {
  if (!TransactionsModel) throw new Error('Transactions Model is missing');
  if (!mongoose) throw new Error('mongoose is missing');

  const { ObjectId } = mongoose.Types;


  return async function (req, res, transactionSummary = {}) {
    // Define members variable
    const { member } = req.params;
    const { start, end } = req.query;

    if (!member) return res.status(400).send('Error: Member ID is missing');

    const noTranscationsResponse = [
      {
        _id: member,
        amountIncome: 0,
        amountExpense: 0,
        totalIncome: 0,
        totalExpense: 0,
      },
    ];

    // Try to build query and fetch transaction summary
    try {
      const transactionQueryPipe = {
        $match: {
          $and: buildSummaryQuery({ member, start, end, ObjectId }),
        },
      };

      const aggregatePipeline = buildSummaryPipeline(transactionQueryPipe);

      transactionSummary = await TransactionsModel.aggregate(aggregatePipeline);
    } catch (fetchMembersError) {
      return res.status(400).send(`Error: ${fetchMembersError.message}`);
    }

    // Aggregate pipeline's $group operator returns an array inside an array.
    // So we need the extract the only object left inside.
    return res.json(transactionSummary[0] || noTranscationsResponse);
  };
}

/**
 * Function to handle member details query when no ID is provided
 */
function idNotProvided (req, res) {
  return res.status(400).send('Error: Member ID was not provided');
}

function buildSummaryPipeline (queryPipe) {
  if (!queryPipe) throw new Error('Query must be provided');

  /**
   * Pipeline to perform an aggregation operation to the Transcations collection.
   * The logic is as follow:
   *
   * 1. Match transcations by member ID.
   * 2. Group by member ID.
   * 3. Count the amount of incomes
   * 4. Count the amount of expenses
   * 5. Sum expenses from all found transactions into totalexpense property
   * 5. Sum expenses from all found transactions into totalexpense property
   * @type {Array}
   */
  return [
    queryPipe,
    {
      $group: {
        _id: '$member',
        amountIncome: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$type', 'income'],
              },
              then: 1,
              else: 0,
            },
          },
        },
        amountExpense: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$type', 'expense'],
              },
              then: 1,
              else: 0,
            },
          },
        },
        totalIncome: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$type', 'income'],
              },
              then: '$amount',
              else: 0,
            },
          },
        },
        totalExpense: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$type', 'expense'],
              },
              then: '$amount',
              else: 0,
            },
          },
        },
      },
    },
  ];
}

function buildSummaryQuery ({ member, start, end, ObjectId }) {
  if (!member) throw new Error('Member ID was not provided');
  if (!ObjectId) throw new Error('ObjectId instance was not provided');

  if ((start && !end) || (!start && end)) {
    throw new Error('Start and end date have to be provided');
  }

  const query = [
    { member: new ObjectId(member) },
  ];

  if (start) query.push({ date: { $gte: new Date(start) } });
  if (end) query.push({ date: { $lte: new Date(end) } });

  return query;
}


module.exports = {
  buildSummaryQuery,
  getTransactionSummary,
  idNotProvided,
  buildSummaryPipeline,
};
