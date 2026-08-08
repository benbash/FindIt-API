import mongoose from 'mongoose';

const foundItemSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    matchedLostItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostItem',
      default: null,
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
    dateFound: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'claimed', 'returned', 'closed'],
      default: 'open',
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    storageLocation: {
      type: String,
      default: '',
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
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('FoundItem', foundItemSchema);
