const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      description: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, default: 'Nigeria', trim: true },
      landmark: { type: String, default: '', trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    dateLost: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'matched', 'recovered', 'closed'],
      default: 'open',
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    rewardAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LostItem', lostItemSchema);
