import { requireAuth } from '../../lib/requireAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  if (email !== 'vishwagohil21@gmail.com') {
    return res.status(403).json({ message: 'Access denied: Not authorized' })
  }

  try {
    const client = await clientPromise
    const db = client.db('shipApp')

    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'Admin account not found in database' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await db.collection('users').updateOne({ email }, { $set: { otp } })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"ARAW Auth" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Your ARAW OTP',
      text: `Your OTP for login is: ${otp}`,
    })

    console.log('✅ OTP sent to Gmail:', otp)

    return res.status(200).json({ message: 'OTP sent to Gmail' })
  } catch (error) {
    console.error('❌ Login error:', error)
    return res.status(500).json({ message: 'Server error. Try again later.' })
  }
}
