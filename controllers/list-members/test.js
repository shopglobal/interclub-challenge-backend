/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable max-len */

// Import functions to test
const { getMembersList } = require('.'); // Require from index of curent dir

describe('list-members module', () => {
  describe('getMembersList function', () => {
    it('should be a function', () => {
      expect(typeof getMembersList).toEqual('function');
    });

    it('should be a currying function', () => {
      expect(typeof getMembersList({})).toEqual('function');
    });

    it('should throw error when first argument is missing', () => {
      function getMembersListWithoutFirstArg () {
        getMembersList();
      }
      expect(getMembersListWithoutFirstArg).toThrow('Members Model is missing');
    });

    it('should return list of users', done => {
      const mockMemberList = [
        {
          _id: '5a1710d301c99584f16a222c',
          first_name: 'Kayli',
          last_name: 'Windler',
          number: 1,
        },
        {
          _id: '5a1710d301c99584f16a222d',
          first_name: 'Stella',
          last_name: 'Rohan',
          number: 2,
        },
      ];

      const MembersModelMock = {
        find () {
          return {
            sort () {
              return mockMemberList;
            },
          };
        },
      };

      // Mock rsponse function, to see if it is executed correctly
      const mockedResFunction = {
        json (arg) {
          expect(arg.length).toEqual(mockMemberList.length);
          done();
        },
      };

      getMembersList(MembersModelMock)({ query: {} }, mockedResFunction);
    });

    it('should catch error', done => {
      const MembersModelMock = {
        find () {
          throw new Error('Error while fetching list of members');
        },
      };

      // Mock rsponse function, to see if it is executed correctly
      const mockedResFunction = {
        status (statusCode) {
          expect(statusCode).toEqual(400);
          return {
            send (errorString) {
              expect(errorString).toEqual('Error: Error while fetching list of members');
              done();
            },
          };
        },
      };

      getMembersList(MembersModelMock)({ query: {} }, mockedResFunction);
    });
  });
});
