const User = require('../models/User');

const getProfile = async (req, res) => {
  const u = await User.findById(req.user.id).select('-passwordHash');
  if (!u) return res.status(404).json({ message: 'User not found' });
  res.json(u);
};

module.exports = { getProfile };
