// pages/api/send-otp.ts
import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import { randomInt } from 'crypto'
import clientPromise from '../../lib/mongodb'
import { setCookie } from 'cookies-next'

const allowedAdmins = ['vishwagohil21@gmail.com', 'kishor.rana321@gmail.com']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body

  if (!allowedAdmins.includes(email)) {
    return res.status(404).json({ message: 'Admin user not found' })
  }

  const otp = randomInt(100000, 999999).toString()

  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')

  const user = await users.findOne({ email })

  if (!user) return res.status(404).json({ message: 'User not found' })

  await users.updateOne({ email }, { $set: { otp } })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for PERFECT-SHIP-APP',
    text: `Your OTP is: ${otp}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    setCookie('resetEmail', email, { req, res, maxAge: 300 }) // 5 min
    res.status(200).json({ message: 'OTP sent' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}
