const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Electronics', 'Wallet/Purse', 'ID/Cards', 'Bag', 'Keys', 'Clothing', 'Jewelry', 'Other'],
      default: 'Other',
    },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, default: '' },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Item', itemSchema);
