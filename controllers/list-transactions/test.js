/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable max-len */

// Import functions to test
const { getTransactionsList } = require('.'); // Require from index of curent dir

describe('list-transactions module', () => {
  describe('list-transactions function', () => {
    it('should be a function', () => {
      expect(typeof getTransactionsList).toEqual('function');
    });

    it('should be a currying function', () => {
      expect(typeof getTransactionsList({})).toEqual('function');
    });

    it('should throw error when first argument is missing', () => {
      function getTransactionsListWithoutFirstArg () {
        getTransactionsList();
      }
      expect(getTransactionsListWithoutFirstArg).toThrow('Transactions Model is missing');
    });
  });
});
