import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { entries } = req.body
  if (!Array.isArray(entries) || entries.length === 0) return res.status(400).json({ message: 'No entries provided' })

  const client = await clientPromise
  const db = client.db('shipApp')

  try {
    // entries include 'id', we need to remove that and extract collection from id
    for (const entry of entries) {
      const [collectionName] = entry.id.split('_')
      if (!collectionName) continue

      // Remove `id` field before inserting
      const { id, ...doc } = entry

      await db.collection(collectionName).insertOne(doc)
    }
    res.status(200).json({ message: 'Undo successful' })
  } catch (err) {
    console.error('Undo failed:', err)
    res.status(500).json({ message: 'Undo failed' })
  }
}
