// pages/api/delete-result.ts
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const body = req.body
  const client = await clientPromise
  const db = client.db('shipApp')

  try {
    const collectionName = body.igType ? (
      body.paid ? 'discharge' : 'loading'
    ) : 'expense'

    const filter = { date: body.date, shipName: body.shipName }

    const result = await db.collection(collectionName).deleteOne(filter)

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Deleted' })
    } else {
      res.status(404).json({ message: 'Item not found' })
    }
  } catch (err) {
    console.error('Delete failed:', err)
    res.status(500).json({ message: 'Delete failed' })
  }
}
