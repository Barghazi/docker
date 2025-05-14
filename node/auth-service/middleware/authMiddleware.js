const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Récupère le token
  
    if (!token) {
      return res.status(403).json({ message: 'Token manquant' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
  }
  

// Middleware pour vérifier le rôle
function checkRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Accès interdit' });
      }
      next();
    };
  }
  
module.exports = { verifyToken, checkRole };
