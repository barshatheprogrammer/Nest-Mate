const mongoose = require('mongoose');

const flatInterestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  status: { type: String, enum: ['interested', 'looking_for_roommate', 'matched'], default: 'interested' },
  lookingForRoommate: { type: Boolean, default: false },
  roommateRequirements: {
    gender: String,
    budget: String,
    foodPreference: String,
    smoking: String,
    drinking: String,
    pets: String,
    studySchedule: String,
    sleepSchedule: String,
    cleanliness: String,
    socialPreference: String,
    about: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FlatInterest', flatInterestSchema);
