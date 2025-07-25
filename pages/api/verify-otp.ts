import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const secret = process.env.JWT_SECRET || 'secret'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, otp } = req.body

  const client = await clientPromise
  const db = client.db('shipApp')
  const user = await db.collection('users').findOne({ email })

  if (!user || user.otp !== otp) {
    return res.status(401).json({ message: 'Invalid OTP' })
  }

  const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

  const isProduction = process.env.NODE_ENV === 'production'

  res.setHeader('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    secure: isProduction,   // true only in production (Vercel)
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60,       // 1 hour expiration
  }))

  res.status(200).json({ message: 'Login successful' })
}
