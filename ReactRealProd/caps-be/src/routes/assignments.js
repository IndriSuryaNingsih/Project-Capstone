const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  listAssignments,
  createAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');

router.get('/', auth, listAssignments);
router.post('/', auth, createAssignment);
router.get('/:id', auth, getAssignment);
router.put('/:id', auth, updateAssignment);
router.delete('/:id', auth, deleteAssignment);

module.exports = router;
