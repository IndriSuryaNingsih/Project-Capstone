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

<<<<<<< HEAD

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
=======
const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
}));

// =======================
// HEALTH CHECK
// =======================
>>>>>>> 1c2da80 (first commit)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

<<<<<<< HEAD
// API routes
=======
// =======================
// ROUTES
// =======================
>>>>>>> 1c2da80 (first commit)
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/progress', progressRoutes);
<<<<<<< HEAD
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
=======
app.use('/api/focus', focusRoutes);
app.use('/api/users', userRoutes);

// =======================
// ERROR HANDLER
// =======================
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// =======================
// START SERVER
// =======================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
>>>>>>> 1c2da80 (first commit)
