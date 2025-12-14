const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  percent: { type: Number, min: 0, max: 100, default: 0 },
  notes: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);
