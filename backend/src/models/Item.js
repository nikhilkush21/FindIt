const mongoose = require('mongoose');

const CATEGORIES = [
  'Electronics', 'Wallet/Purse', 'ID/Cards', 'Keys',
  'Bag', 'Clothing', 'Jewelry', 'Books/Documents',
  'Accessories', 'Other',
];

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    category: { type: String, enum: CATEGORIES, default: 'Other' },
    images: [{ type: String }],            // Cloudinary URLs
    location: { type: String, required: true, trim: true, maxlength: 200 },
    // Optional GeoJSON for proximity search
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['open', 'claimed', 'resolved', 'expired'],
      default: 'open',
    },
    // Extra characteristics for better matching
    identifyingFeatures: { type: String, default: '', maxlength: 500 },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Moderation
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // auto-approve; admins can set to pending for review flow
    },
    moderationNote: { type: String, default: '' },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: { type: Date },
    // AI embedding cache (stored as JSON string to avoid heavy array indexing)
    textEmbedding: { type: String, default: '' },
    imageEmbedding: { type: String, default: '' },
    embeddingUpdatedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

itemSchema.index({ type: 1, status: 1, category: 1 });
itemSchema.index({ title: 'text', description: 'text', location: 'text', identifyingFeatures: 'text' });
itemSchema.index({ reportedBy: 1 });
itemSchema.index({ date: -1 });
itemSchema.index({ moderationStatus: 1 });

module.exports = mongoose.model('Item', itemSchema);
module.exports.CATEGORIES = CATEGORIES;
