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
    enum: ['Single', 'Shared', 'Any'],
    default: 'Any'
  },
  
  // Lifestyle
  foodPreference: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Any'],
    default: 'Any'
  },
  smoking: {
    type: String,
    enum: ['Yes', 'No', 'Occasionally'],
    default: 'No'
  },
  drinking: {
    type: String,
    enum: ['Yes', 'No', 'Occasionally'],
    default: 'No'
  },
  pets: {
    type: String,
    enum: ['Yes', 'No', 'Comfortable with pets'],
    default: 'No'
  },
  studySchedule: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    default: 'Evening'
  },
  sleepSchedule: {
    type: String,
    enum: ['Early Sleeper', 'Flexible', 'Late Sleeper'],
    default: 'Flexible'
  },
  cleanliness: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    default: 'Moderate'
  },
  socialPreference: {
    type: String,
    enum: ['Introvert', 'Balanced', 'Extrovert'],
    default: 'Balanced'
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
