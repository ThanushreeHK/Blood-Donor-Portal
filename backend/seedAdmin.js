require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createUser, findByEmail } = require('./models/User');

async function seedAdmin() {
  const email = 'admin@bloodlink.com';
  const password = 'Admin@123';

  const existing = await findByEmail(email);
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await createUser({
    name: 'Super Admin',
    email: email,
    passwordHash: passwordHash,
    role: 'admin',
    phone: '0000000000',
    consent: true
  });

  console.log('✅ Admin created!');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit(0);
}

seedAdmin();