const mongoose = require('mongoose');

const abuseReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: {
      type: String,
      enum: ['spam', 'fake', 'inappropriate', 'harassment', 'duplicate', 'other'],
      required: true,
    },
    details: { type: String, default: '', maxlength: 1000 },
    status: {
      type: String,
      enum: ['open', 'reviewed', 'resolved', 'dismissed'],
      default: 'open',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    adminAction: { type: String, default: '' },
  },
  { timestamps: true }
);

abuseReportSchema.index({ status: 1 });
abuseReportSchema.index({ reporter: 1 });

module.exports = mongoose.model('AbuseReport', abuseReportSchema);
