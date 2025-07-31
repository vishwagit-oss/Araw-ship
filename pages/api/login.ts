import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

// Normalize allowed admin emails
const allowedAdmins = process.env.ALLOWED_ADMINS?.split(',')
  .map(e => e.trim().toLowerCase()) || []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()

  console.log({ email, allowedAdmins })

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }

  if (!allowedAdmins.includes(email)) {
    console.log('❌ Email not in allowed list')
    return res.status(403).json({ message: 'Access denied' })
  }

  try {
    const client = await clientPromise
    const db = client.db('shipApp')

    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in DB
    await db.collection('users').updateOne({ email }, { $set: { otp } })

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"ARAW Auth" <${process.env.ADMIN_EMAIL}>`,
      to: email, // Send OTP to selected admin
      subject: 'Your OTP for ARAW Login',
      text: `Your OTP is: ${otp}`,
    })

    return res.status(200).json({ message: 'OTP sent to your email' })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ message: 'Failed to send OTP email' })
  }
}
