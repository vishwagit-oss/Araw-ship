import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'No ids provided' })

  const client = await clientPromise
  const db = client.db('shipApp')

  try {
    for (const fullId of ids) {
      // fullId example: 'loading_62a4bc...'
      const [collectionName, mongoId] = fullId.split('_')
      if (!collectionName || !mongoId) continue // skip invalid

      await db.collection(collectionName).deleteOne({ _id: new ObjectId(mongoId) })
    }

    res.status(200).json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error('Delete failed:', err)
    res.status(500).json({ message: 'Delete failed' })
  }
}
