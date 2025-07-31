import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

const OTP_EXPIRY_MINUTES = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email,  newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: 'Email and newpassword are required' });

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ message: 'Password too short' });

      const hashed = await bcrypt.hash(newPassword, 10);
      await users.updateOne(
        { email },
        { $set: { password: hashed }, $unset: { otp: '', otpCreatedAt: '' } }
      );

      return res.status(200).json({ message: 'Password reset successfully' });
    } else {
      // OTP verified but no password yet
      return res.status(200).json({ message: 'OTP verified' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
