const Progress = require('../models/Progress');

// GET /api/progress
const getProgress = async (req, res) => {
  try {
    const userId = req.user.id; // dari token (auth middleware)

    const items = await Progress.find({ user: userId }).populate('assignment');

    res.json(items);
  } catch (err) {
    console.error('Error getProgress:', err);
    res.status(500).json({ message: 'Gagal mengambil data progress' });
  }
};

// PUT /api/progress
const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id; // dari token
    const { assignmentId, percent, notes } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ message: 'assignmentId is required' });
    }

    let p = await Progress.findOne({
      user: userId,
      assignment: assignmentId,
    });

    if (!p) {
      p = await Progress.create({
        user: userId,
        assignment: assignmentId,
        percent: percent ?? 0,
        notes,
      });
    } else {
      if (percent !== undefined) p.percent = percent;
      if (notes !== undefined) p.notes = notes;
      p.updatedAt = new Date();
      await p.save();
    }

    res.json(p);
  } catch (err) {
    console.error('Error updateProgress:', err);
    res.status(500).json({ message: 'Gagal mengubah progress' });
  }
};

module.exports = { getProgress, updateProgress };
