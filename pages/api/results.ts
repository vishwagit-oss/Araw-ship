import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('shipApp') // ✅ match your real DB name

    const { ship, start, end } = req.query
    const filter: any = {}

    // ✅ Apply ship filter (exact match)
    if (ship) filter.shipName = ship

    // ✅ Apply date string filters
    if (start || end) {
      filter.date = {}
      if (start) filter.date.$gte = start
      if (end) filter.date.$lte = end
    } else {
      // Default: last 30 days
      const today = new Date()
      const past30 = new Date(today)
      past30.setDate(today.getDate() - 30)
      const pastDateStr = past30.toISOString().split('T')[0]
      filter.date = { $gte: pastDateStr }
    }

    // Apply filter to all 3 collections
    const [loading, discharge, expense] = await Promise.all([
      db.collection('loading').find(filter).toArray(),
      db.collection('discharge').find(filter).toArray(),
      db.collection('expense').find(filter).toArray(),
    ])

    const formatEntry = (e: any, type: string) => ({
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
