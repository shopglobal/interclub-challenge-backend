/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const MemberModel = require('./models/members');
const TransactionModel = require('./models/transactions');

const amountMembers = 9;
const maxTransactions = 20;
const memberPromises = [];

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/interclub-challenge', { useMongoClient: true });

console.log('Creating fake members...');

MemberModel.remove({})
  .then(() => {
    return TransactionModel.remove({});
  })
  .then(() => {
    for (let i = 0; i < amountMembers; i++) {
      memberPromises.push(createFakeMember(i));
    }

    return Promise.all(memberPromises);
  })
  .then(results => {
    console.log(`Created ${results.length} fake members with transactions`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function createFakeMember (iterator) {
  const transactionPromises = [];

  const newMember = new MemberModel({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    number: iterator + 1,
    email: iterator % 2 === 0 ? faker.internet.email() : undefined,
  });

  const member = await newMember.save();

  for (let i = 0; i < _.random(maxTransactions); i++) {
    transactionPromises.push(createTransaction(member));
  }

  return Promise.all(transactionPromises);
}

function createTransaction (member) {
  return new TransactionModel({
    amount: _(_.random(100, true)).round(2),
    type: _.random(10) % 3 === 0 ? 'expense' : 'income',
    member,
    date: moment().subtract(_.random(6), 'months'),
  }).save();
}
