import { requireAuth } from '../../lib/requireAuth'
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const client = await clientPromise;
    const db = client.db('shipApp');

    const data = req.body;  // <-- changed here

    await db.collection('discharge').insertOne({ ...data, createdAt: new Date() });
    res.status(200).json({ message: 'Discharge data saved successfully' });
  } catch (err) {
    console.error('Discharge API error:', err);
    res.status(500).json({ error: 'Failed to save discharge data' });
  }
}
