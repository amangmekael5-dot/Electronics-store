const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const productRoutes = require('./routes/products');
const authRoutes    = require('./routes/auth');
const adminRoutes   = require('./routes/admin');
const orderRoutes   = require('./routes/orders');

// ── CORS ── allow both Vite dev ports
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Body Parsing ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection ──
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electrostore')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ── Health-check / Test Route ──
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ ElecStore Backend is running!',
    timestamp: new Date().toISOString(),
  });
});

// ── Products Routes ──
app.use('/api/products', productRoutes);

// ── Auth Routes ──
app.use('/api/auth', authRoutes);

// ── Admin Routes ──
app.use('/api/admin', adminRoutes);

// ── Order Routes ──
app.use('/api/orders', orderRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Test API:     http://localhost:${PORT}/api/test`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
});