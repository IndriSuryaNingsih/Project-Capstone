require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./src/routes/auth');
const assignmentRoutes = require('./src/routes/assignments');
const feedbackRoutes = require('./src/routes/feedback');
const progressRoutes = require('./src/routes/progress');
const userRoutes = require('./src/routes/users');
const focusRoutes = require('./src/routes/focus');


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/focus', focusRoutes);   // <--- ini baru
app.use('/api/users', userRoutes);


// Global error handler (basic)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log('Server listening on port', PORT);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
