/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable max-len */

const {
  idNotProvided,
  getTransactionSummary,
  buildSummaryPipeline,
  buildSummaryQuery,
} = require('.');

describe('transaction-summary module', () => {
  describe('idNotProvided function', () => {
    it('should be a function', () => {
      expect(typeof idNotProvided).toEqual('function');
    });

    it('should send error message', (done) => {
      const mockRes = {
        status (statusCode) {
          expect(statusCode).toEqual(400);
          return {
            send (error) {
              expect(error).toEqual('Error: Member ID was not provided');
              done();
            },
          };
        },
      };

      idNotProvided({}, mockRes);
    });
  });

  describe('buildSummaryQuery function', () => {
    it('should be a function', () => {
      expect(typeof buildSummaryQuery).toEqual('function');
    });

    it('should send error message', (done) => {
      const mockRes = {
        status (statusCode) {
          expect(statusCode).toEqual(400);
          return {
            send (error) {
              expect(error).toEqual('Error: Member ID was not provided');
              done();
            },
          };
        },
      };

      idNotProvided({}, mockRes);
    });
  });

  describe('buildSummaryQuery function', () => {
    it('should be a function', () => {
      expect(typeof buildSummaryQuery).toEqual('function');
    });

    it('should return missing member Id error', () => {
      function buildSummaryQueryWihtoutMemberId () {
        buildSummaryQuery({});
      }

      expect(buildSummaryQueryWihtoutMemberId)
        .toThrow('Member ID was not provided');
    });

    it('should return missing ObjectId error', () => {
      function buildSummaryQueryWihtoutMemberId () {
        buildSummaryQuery({ member: true });
      }

      expect(buildSummaryQueryWihtoutMemberId)
        .toThrow('ObjectId instance was not provided');
    });

    it('should return missing start date error', () => {
      function buildSummaryQueryWihtoutMemberId () {
        buildSummaryQuery({ member: true, ObjectId: true, end: new Date() });
      }

      expect(buildSummaryQueryWihtoutMemberId)
        .toThrow('Start and end date have to be provided');
    });

    it('should return missing end date error', () => {
      function buildSummaryQueryWihtoutMemberId () {
        buildSummaryQuery({ member: true, ObjectId: true, start: new Date() });
      }

      expect(buildSummaryQueryWihtoutMemberId)
        .toThrow('Start and end date have to be provided');
    });

    it('should return return query with only objectId', () => {
      // Mock ObjectId class
      function ObjectId (id) {
        this.id = id;
        return id;
      }

      // Member id
      const member = 'member';

      // Get summary query from mocked data
      const result = buildSummaryQuery({ member, ObjectId });

      expect(result[0].member.id).toEqual(member);
    });

    it('should return return query with objectId, start and end dates', () => {
      // Mock ObjectId class
      function ObjectId (id) {
        this.id = id;
        return id;
      }

      // Member id
      const memberId = 'member';
      const end = new Date();
      const start = new Date();

      // Get summary query from mocked data
      const [memberObject, startObject, endObject] =
        buildSummaryQuery({ member: memberId, ObjectId, start, end });

      expect(memberObject.member.id).toEqual(memberId);
      expect(startObject.date.$gte).toEqual(start);
      expect(endObject.date.$lte).toEqual(end);
    });
  });

  describe('buildSummaryPipeline function', () => {
    it('should be a function', () => {
      expect(typeof buildSummaryPipeline).toEqual('function');
    });

    it('should return missing query error', () => {
      function buildSummaryPipelineWihtoutQueryPipe () {
        buildSummaryPipeline();
      }

      expect(buildSummaryPipelineWihtoutQueryPipe)
        .toThrow('Query must be provided');
    });

    it('should return built pipeline', () => {
      const member = 'memberId';

      const queryPipe = {
        $match: {
          $or: [
            { member },
          ],
        },
      };

      const expectedObject = [
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
        }];

      expect(buildSummaryPipeline(queryPipe)).toMatchObject(expectedObject);
    });
  });

  describe('getTransactionSummary function', () => {
    it('should be a function', () => {
      expect(typeof getTransactionSummary).toEqual('function');
    });

    it('should return missing Transactions model error', () => {
      function getTransactionSummaryWithoutTranscationsModel () {
        getTransactionSummary({});
      }

      expect(getTransactionSummaryWithoutTranscationsModel)
        .toThrow('Transactions Model is missing');
    });

    it('should return missing mongoose error', () => {
      function getTransactionSummaryWithoutMongoose () {
        getTransactionSummary({ TransactionsModel: true });
      }

      expect(getTransactionSummaryWithoutMongoose)
        .toThrow('mongoose is missing');
    });

    it('should be a currying function', () => {
      const validArgs =
        { TransactionsModel: true, mongoose: { Types: { ObjectId: true } } };

      expect(typeof getTransactionSummary(validArgs)).toEqual('function');
    });

    it('should return missing member id error', done => {
      const validArgs =
        { TransactionsModel: true, mongoose: { Types: { ObjectId: true } } };

      const mockReq = {
        params: {
          member: false,
          start: new Date(),
          end: new Date(),
        },
      };

      const mockRes = {
        status (statusCode) {
          expect(statusCode).toEqual(400);
          return {
            send (error) {
              expect(error).toEqual('Error: Member ID is missing');
              done();
            },
          };
        },
      };

      getTransactionSummary(validArgs)(mockReq, mockRes);
    });

    it('should catch aggregateError error', done => {
      // Define aggregate error message to be caught
      const aggregateErrorMessage = 'Aggregate error';

      // Valid mocked args
      const validArgs = {
        TransactionsModel: {
          async aggregate () {
            throw new Error(aggregateErrorMessage);
          },
        },
        mongoose: {
          Types: {
            ObjectId: true,
          },
        },
        buildSummaryQuery () {
          return [];
        },
        buildSummaryPipeline () {
          return {};
        },
      };

      // Mock Request object
      const mockReq = {
        params: {
          member: true,
          start: new Date(),
          end: new Date(),
        },
      };

      // Mock response object
      const mockRes = {
        status (statusCode) {
          expect(statusCode).toEqual(400);
          return {
            send (error) {
              expect(error).toEqual(`Error: ${aggregateErrorMessage}`);
              done();
            },
          };
        },
      };

      getTransactionSummary(validArgs)(mockReq, mockRes);
    });

    it('should return correct transcation summary', done => {
      // Valid mocked args
      const validArgs = {
        TransactionsModel: {
          async aggregate () {
            return [{ valid: true }];
          },
        },
        mongoose: {
          Types: {
            ObjectId: true,
          },
        },
        buildSummaryQuery () {
          return [];
        },
        buildSummaryPipeline () {
          return {};
        },
      };

      // Mock Request object
      const mockReq = {
        params: {
          member: true,
          start: new Date(),
          end: new Date(),
        },
      };

      // Mock response object
      const mockRes = {
        json (summary) {
          expect(summary.valid).toEqual(true);
          done();
        },
      };

      getTransactionSummary(validArgs)(mockReq, mockRes);
    });
  });
});
