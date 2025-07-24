const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI; // Loaded from .env.local
const DB_NAME = 'shipApp';

async function insertAdmin() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = {
    name: 'Admin',
    email: 'vishwagohil21@gmail.com',
    password: passwordHash,
    otp: '000000',
    status: 'approved',
    role: 'admin',
    createdAt: new Date(),
  };

  await db.collection('users').deleteMany({ email: admin.email });
  await db.collection('users').insertOne(admin);

  console.log('✅ Admin inserted successfully with password: admin123');
  process.exit(0);
}

insertAdmin().catch((err) => {
  console.error('❌ Failed to insert admin:', err);
  process.exit(1);
});
