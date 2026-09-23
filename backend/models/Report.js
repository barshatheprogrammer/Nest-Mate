const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat'
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  reason: {
    type: String,
    enum: [
      'Fake Profile',
      'Fake Listing',
      'Incorrect Rent',
      'Inappropriate Content',
      'Harassment',
      'Spam',
      'Suspicious Activity',
      'Other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Report', reportSchema);
