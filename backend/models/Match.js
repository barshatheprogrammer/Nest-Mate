const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  flatMatchScore: { type: Number, required: true },
  roommateMatchScore: { type: Number, required: true },
  overallScore: { type: Number, required: true },
  status: { type: String, enum: ['potential', 'requested', 'connected', 'rejected'], default: 'potential' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
