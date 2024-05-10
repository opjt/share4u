import { MongoClient } from 'mongodb';

const url = process.env.MONGODB;
const options = { useNewUrlParser: true };

let client;

async function connectDB() {
  if (!client) {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongo) {
        global._mongo = new MongoClient(url, options).connect();
      }
      client = global._mongo;
    } else {
      client = new MongoClient(url, options).connect();
    }
  }
  return client;
}

async function getDB() {
  const client = await connectDB();
  return client.db("hr");
}

export { connectDB, getDB };