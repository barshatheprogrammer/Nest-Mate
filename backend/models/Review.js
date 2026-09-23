const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'removed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
