import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const client = await clientPromise;
    const db = client.db('shipApp');
    const data = JSON.parse(req.body);

    await db.collection('expense').insertOne({ ...data, createdAt: new Date() });
    res.status(200).json({ message: 'Expense data saved successfully' });
  } catch (err) {
    console.error('Expense API error:', err);
    res.status(500).json({ error: 'Failed to save expense data' });
  }
}
