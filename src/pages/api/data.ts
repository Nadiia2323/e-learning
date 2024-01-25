// pages/api/somedata.js
import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('e-learning'); // Replace with your database name

    // Example: Fetch data from a collection
    const data = await db.collection('users').find({}).toArray();

    res.status(200.0json({ data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
