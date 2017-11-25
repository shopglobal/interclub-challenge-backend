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
});
