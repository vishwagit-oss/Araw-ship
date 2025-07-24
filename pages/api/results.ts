import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('shipApp')

    const { ship, start, end } = req.query
    const filter: any = {}

    if (ship) filter.shipName = ship

    if (start || end) {
      filter.date = {}
      if (start) filter.date.$gte = start
      if (end) filter.date.$lte = end
    } else {
      const today = new Date()
      const past30 = new Date(today)
      past30.setDate(today.getDate() - 30)
      const pastDateStr = past30.toISOString().split('T')[0]
      filter.date = { $gte: pastDateStr }
    }

    // Fetch from all collections
    const [loading, discharge, expense] = await Promise.all([
      db.collection('loading').find(filter).toArray(),
      db.collection('discharge').find(filter).toArray(),
      db.collection('expense').find(filter).toArray(),
    ])

    const formatEntry = (e: any, type: string) => ({
      id: `${type}_${e._id.toString()}`, // <-- unique id combining collection + Mongo _id
      date: e.date,
      shipName: e.shipName,
      buyerOrOurShip: type === 'expense' ? e.toShip : e.shipTarget,
      igType: e.igType,
      mt: e.mtValue || e.mt,
      usdPrice: e.usdRate || e.rateUsd,
      valueAED: e.totalValueAED || e.newCash,
      paid: e.customerMoney || e.receivedAmount,
      totalPaid: e.totalPaid || '-',
      remarks: e.internalDischarge || '',
    })

    const merged = [
      ...loading.map(e => formatEntry(e, 'loading')),
      ...discharge.map(e => formatEntry(e, 'discharge')),
      ...expense.map(e => formatEntry(e, 'expense')),
    ]

    merged.sort((a, b) => (a.date > b.date ? -1 : 1))

    res.status(200).json(merged)
  } catch (error) {
    console.error('Filter error:', error)
    res.status(500).json({ message: 'Failed to fetch results' })
  }
}
