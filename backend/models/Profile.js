const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  location: { type: String }, // specific area preferred
  bio: { type: String, maxLength: 500 },
  
  // Budget
  budgetMin: { type: Number, required: true },
  budgetMax: { type: Number, required: true },
  
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
