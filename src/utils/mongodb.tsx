
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then(client => {
        console.log('Connected to MongoDB');
        return client;
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then(client => {
      console.log('Connected to MongoDB');
      return client;
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB', err);
      throw err;
    });
}

export default clientPromise;

