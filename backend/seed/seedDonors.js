require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createUser } = require('../models/User');
const { createDonor } = require('../models/Donor');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Pooja', 'Ravi', 'Anjali', 'Kiran', 'Neha', 'Arjun', 'Divya', 'Suresh', 'Kavya', 'Rohan'];
const karnatakaCities = ['Davanagere', 'Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Shivamogga', 'Tumakuru'];

async function seed() {
  console.log("Seeding 40 fake donors across Karnataka...");
  const passwordHash = await bcrypt.hash('Donor@123', 10);

  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const email = `donor${Date.now()}_${i}@example.com`;
    const phone = `98765432${i.toString().padStart(2, '0')}`;
    const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
    const city = karnatakaCities[Math.floor(Math.random() * karnatakaCities.length)];

    const userId = await createUser({
      name: firstName, email, passwordHash, role: 'donor', phone, consent: true
    });

    await createDonor({
      userId, name: firstName, email, bloodGroup, 
      city: city, 
      state: 'Karnataka', 
      area: 'Center',
      dob: '1995-01-01', phone, lastDonationDate: null, isAvailable: true, consent: true
    });

    console.log(`✅ Created: ${firstName} (${bloodGroup}) in ${city}`);
  }
  console.log("Done seeding donors!");
  process.exit(0);
}

seed();