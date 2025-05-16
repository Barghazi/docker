const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
  console.log('[Auth] Checking token');
  const authHeader = req.header('Authorization');
  console.log('[Auth] Authorization header:', authHeader);
  
  const token = authHeader?.split(' ')[1]; // Récupère le token
  
  if (!token) {
    console.log('[Auth] Token missing');
    return res.status(403).json({ message: 'Token manquant' });
  }

  try {
    console.log('[Auth] Verifying token');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[Auth] Token valid for user:', { id: decoded.id, role: decoded.role });
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    return res.status(403).json({ message: 'Token invalide' });
  }
}

// Middleware pour vérifier le rôle
function checkRole(role) {
  return (req, res, next) => {
    console.log('[Auth] Checking role:', { required: role, actual: req.user.role });
    if (req.user.role !== role) {
      console.log('[Auth] Role check failed');
      return res.status(403).json({ message: 'Accès interdit' });
    }
    console.log('[Auth] Role check passed');
    next();
  };
}

module.exports = { verifyToken, checkRole };
