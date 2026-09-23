const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (admin) {
      console.log('Admin already exists. Updating role to admin and resetting password to admin123 just in case.');
      admin.role = 'admin';
      admin.password = 'admin123';
      await admin.save();
      console.log('Admin updated.');
    } else {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        city: 'System'
      });
      console.log('Admin user created successfully.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
