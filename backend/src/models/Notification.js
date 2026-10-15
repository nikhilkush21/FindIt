const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'claim_received',
        'claim_approved',
        'claim_rejected',
        'match_found',
        'item_moderated',
        'item_resolved',
        'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    relatedClaim: { type: mongoose.Schema.Types.ObjectId, ref: 'ClaimRequest' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
