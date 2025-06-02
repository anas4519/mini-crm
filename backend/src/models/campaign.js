const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  segmentName: { type: String, required: true },
  segmentRules: [{
    field: String,
    operator: String,
    value: String
  }],
  audienceSize: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'SENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  totalSent: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);