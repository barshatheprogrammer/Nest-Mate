const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'owner', 'admin'],
    default: 'student'
  },
  phone: {
    type: String
  },
  profileImage: {
    type: String,
    default: 'default.jpg'
  },
  coverImage: {
    type: String,
    default: 'default_cover.jpg'
  },
  college: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  city: {
    type: String,
    required: [true, 'Please add your city']
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'blocked'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
