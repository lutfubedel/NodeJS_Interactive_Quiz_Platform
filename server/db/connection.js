import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { clear } from 'console';

dotenv.config();

const URI = process.env.VITE_ATLAS_URI;
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error(err);
  }
}

function closeDatabase() {
  return client.close();
}

let db = client.db('employees');

// Export functions
export { connectToDatabase, closeDatabase };
export default db;