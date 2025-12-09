const FocusSession = require('../models/FocusSession');

// GET /api/focus  → ambil riwayat sesi fokus user
const getFocusSessions = async (req, res) => {
try {
    const userId = req.user.id;

    const sessions = await FocusSession.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(sessions);
} catch (err) {
    console.error('Error getFocusSessions:', err);
    res.status(500).json({ message: 'Gagal mengambil riwayat fokus' });
}
};

// POST /api/focus  → simpan sesi fokus baru
const createFocusSession = async (req, res) => {
try {
    const userId = req.user.id;
    const { durationMinutes, note, startedAt, finishedAt } = req.body;

    if (!durationMinutes) {
    return res.status(400).json({ message: 'durationMinutes is required' });
    }

    const session = await FocusSession.create({
    user: userId,
    durationMinutes,
    note,
    startedAt: startedAt ? new Date(startedAt) : undefined,
    finishedAt: finishedAt ? new Date(finishedAt) : undefined,
    });

    res.status(201).json(session);
} catch (err) {
    console.error('Error createFocusSession:', err);
    res.status(500).json({ message: 'Gagal menyimpan sesi fokus' });
}
};

module.exports = { getFocusSessions, createFocusSession };
