const Feedback = require('../models/Feedback');

const sendFeedback = async (req, res) => {
  const { message, rating } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  const fb = await Feedback.create({
    user: req.user.id,
    message,
    rating
  });

  res.status(201).json(fb);
};

const listFeedback = async (_req, res) => {
  const items = await Feedback.find().populate('user', 'name email');
  res.json(items);
};

module.exports = { sendFeedback, listFeedback };
