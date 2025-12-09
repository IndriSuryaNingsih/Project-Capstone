const Assignment = require('../models/Assignment');

const listAssignments = async (req, res) => {
  const items = await Assignment.find().populate('createdBy', 'name email');
  res.json(items);
};

const createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const a = await Assignment.create({
    title,
    description,
    dueDate,
    createdBy: req.user.id
  });
  res.status(201).json(a);
};

const getAssignment = async (req, res) => {
  const a = await Assignment.findById(req.params.id);
  if (!a) return res.status(404).json({ message: 'Not found' });
  res.json(a);
};

const updateAssignment = async (req, res) => {
  const a = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!a) return res.status(404).json({ message: 'Not found' });
  res.json(a);
};

const deleteAssignment = async (req, res) => {
  const a = await Assignment.findByIdAndDelete(req.params.id);
  if (!a) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

module.exports = {
  listAssignments,
  createAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment
};
