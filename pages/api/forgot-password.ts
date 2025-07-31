import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const client = await clientPromise;
  const db = client.db('shipApp');
  const user = await db.collection('users').findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await db.collection('users').updateOne({ email }, { $set: { otp, otpCreatedAt: new Date() } });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ARAW Auth" <${process.env.ADMIN_EMAIL}>`,
    to: email,
    subject: 'Reset Password - OTP',
    text: `Your OTP to reset password is: ${otp}`,
  });

  return res.status(200).json({ message: 'OTP sent' });
}
