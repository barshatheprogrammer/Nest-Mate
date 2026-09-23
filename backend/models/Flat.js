const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  location: { type: String, required: true },
  city: { type: String, required: true },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number },
  bhk: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  furnished: { type: String, enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'], default: 'Unfurnished' },
  amenities: [{ type: String }],
  nearbyCollege: { type: String },
  nearbyTransport: { type: String },
  availableFrom: { type: Date },
  roommatesNeeded: { type: Number, default: 1 },
  ownerName: { type: String },
  ownerContact: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'inactive'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flat', flatSchema);
