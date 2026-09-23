const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  compatibilityScore: { type: Number },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
