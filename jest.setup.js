import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

module.exports = async () => {
  const uri = await mongod.getUri();
  process.env.MONGODB_URI = uri;
};