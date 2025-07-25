import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const client = await clientPromise
    const db = client.db('shipApp')

    const data = req.body // ✅ DO NOT PARSE — Next.js parses JSON automatically

    await db.collection('loading').insertOne({ ...data, createdAt: new Date() })

    res.status(200).json({ message: 'Loading data saved successfully' })
  } catch (err) {
    console.error('Loading API error:', err)
    res.status(500).json({ error: 'Failed to save loading data' })
  }
}
