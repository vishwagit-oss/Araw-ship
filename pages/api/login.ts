import { requireAuth } from '../../lib/requireAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }

  const client = await clientPromise
  const db = client.db('shipApp')

  const user = await db.collection('users').findOne({ email })

  if (!user || user.email !== 'vishwagohil21@gmail.com') {
    return res.status(403).json({ message: 'Access denied' })
  }

  console.log("📥 Entered password:", password)
  console.log("🔐 Stored hash:", user.password)

  const match = await bcrypt.compare(password.trim(), user.password)
  console.log("✅ Password match result:", match)

  if (!match) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  await db.collection('users').updateOne({ email }, { $set: { otp } })

  // Send OTP via Gmail
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ✅ Required for self-signed certs during dev
      },
    })

    await transporter.sendMail({
      from: `"ARAW Auth" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Your OTP for ARAW Login',
      text: `Your OTP is: ${otp}`,
    })

    console.log('✅ OTP sent to Gmail:', otp)
    res.status(200).json({ message: 'OTP sent to your email' })
  } catch (err) {
    console.error('❌ Email send failed:', err)
    res.status(500).json({ message: 'Failed to send OTP email' })
  }
}
