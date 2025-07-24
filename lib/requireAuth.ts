import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const secret = process.env.JWT_SECRET || 'secret'

export function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token
  if (!token) {
    res.status(401).json({ message: 'Not authenticated' })
    return false
  }

  try {
    jwt.verify(token, secret)
    return true
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
    return false
  }
}
