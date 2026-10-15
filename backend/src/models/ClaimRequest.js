const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, maxlength: 1000 },
    // Private verification answers — never exposed publicly
    verificationAnswers: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNote: { type: String, default: '' },
    // Contact sharing: only revealed after approval
    contactShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

claimSchema.index({ item: 1, claimant: 1 }, { unique: true }); // one claim per user per item
claimSchema.index({ claimant: 1 });
claimSchema.index({ status: 1 });

module.exports = mongoose.model('ClaimRequest', claimSchema);
