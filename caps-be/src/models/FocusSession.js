const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema(
{
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    // durasi yang benar-benar dijalankan (menit)
    durationMinutes: {
    type: Number,
    required: true,
    },
    // kapan sesi dimulai
    startedAt: {
    type: Date,
    default: Date.now,
    },
    // kapan sesi selesai (opsional)
    finishedAt: {
    type: Date,
    },
    note: {
    type: String,
    trim: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('FocusSession', focusSessionSchema);
