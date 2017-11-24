const PORT = process.env.PORT || 4000;
const ROOT_PATH = process.env.PWD;
const DATABASE_URL =
  process.env.MONGO_URL || 'mongodb://localhost:27017/interclub-challenge';

module.exports = {
  PORT,
  ROOT_PATH,
  DATABASE_URL,
};
