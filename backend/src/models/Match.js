const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    lostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    foundItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    overallScore: { type: Number, default: 0, min: 0, max: 1 },
    componentScores: {
      text: { type: Number, default: 0 },
      image: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      date: { type: Number, default: 0 },
    },
    weights: {
      text: { type: Number, default: 0.4 },
      image: { type: Number, default: 0.3 },
      location: { type: Number, default: 0.2 },
      date: { type: Number, default: 0.1 },
    },
    aiStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'fallback'],
      default: 'pending',
    },
    aiError: { type: String, default: '' },
    computedAt: { type: Date },
    // dismissed by the owner to hide from their matches list
    dismissedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

matchSchema.index({ lostItem: 1, foundItem: 1 }, { unique: true });
matchSchema.index({ lostItem: 1, overallScore: -1 });
matchSchema.index({ foundItem: 1, overallScore: -1 });
matchSchema.index({ aiStatus: 1 });

module.exports = mongoose.model('Match', matchSchema);
