const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/auth');
const User = require('./models/User');
const { verifyToken, checkRole } = require('./middleware/authMiddleware');

const app = express();

// Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reservation-salle';
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware - Log all requests BEFORE route handling
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n=== New Request ===');
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Body:', req.method === 'PUT' || req.method === 'POST' ? JSON.stringify(req.body, null, 2) : 'N/A');
  next();
});

// Mount authentication routes
console.log('Mounting auth routes at /api/auth');
app.use('/api/auth', authRoutes);

// Protected admin route
app.get('/api/admin', verifyToken, checkRole('gestionnaire'), (req, res) => {
  console.log("Admin route accessed");
  res.json({ message: 'Contenu réservé au gestionnaire' });
});

// 404 Error handler
app.use((req, res) => {
  const error = {
    message: 'Route non trouvée',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  };
  console.log('[404]', error);
  res.status(404).json(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    console.log('Attempting to connect to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('\nAvailable routes:');
      console.log('- POST   /api/auth/register');
      console.log('- POST   /api/auth/login');
      console.log('- GET    /api/auth/users');
      console.log('- GET    /api/auth/users/:id');
      console.log('- PUT    /api/auth/users/:id');
      console.log('- DELETE /api/auth/users/:id');
    });

    // Handle server shutdown
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    console.log('\nPlease ensure MongoDB is installed and running:');
    console.log('1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community');
    console.log('2. Install MongoDB following the instructions');
    console.log('3. Start the MongoDB service');
    process.exit(1);
  }
}

// Start the server
startServer();
