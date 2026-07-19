const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const REASONS = ['inaccurate', 'inappropriate', 'spam', 'scam', 'other'];

const reportSchema = new Schema({
  listing:  { type: Schema.Types.ObjectId, ref: 'listing', required: true },
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason:   { type: String, enum: REASONS, required: true },
  details:  { type: String, default: '' },
  status:   { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
module.exports.REASONS = REASONS;
