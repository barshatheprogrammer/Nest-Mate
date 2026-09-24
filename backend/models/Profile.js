const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Any'], default: 'Any' },
  age: { type: Number, default: 0 },
  course: { type: String, default: 'Not specified' },
  location: { type: String, default: 'Not specified' },
  bio: { type: String, maxLength: 500 },
  
  // Budget
  budgetMin: { type: Number, default: 0 },
  budgetMax: { type: Number, default: 0 },
  
  // Room Preferences
  roomType: { 
    type: String, 
    default: 'Any'
  },
  
  // Lifestyle
  foodPreference: {
    type: String,
    default: 'Any'
  },
  smoking: {
    type: String,
    default: 'No'
  },
  drinking: {
    type: String,
    default: 'No'
  },
  pets: {
    type: String,
    default: 'No'
  },
  studySchedule: {
    type: String,
    default: 'Flexible'
  },
  sleepSchedule: {
    type: String,
    default: 'Flexible'
  },
  cleanliness: {
    type: String,
    default: 'Average'
  },
  socialPreference: {
    type: String,
    default: 'Balanced'
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
