const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const User = require('../models/User');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Log middleware pour les routes d'authentification
router.use((req, res, next) => {
  console.log('\n[Auth Route]', {
    method: req.method,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.method === 'PUT' || req.method === 'POST' ? req.body : undefined
  });
  next();
});

// ✅ Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log('[REGISTER] Tentative d\'inscription:', { username, role });

    // Vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log('[REGISTER] Utilisateur existe déjà:', { username });
      return res.status(400).json({ message: 'Utilisateur existe déjà' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({ username, password: hashedPassword, role });
    
    try {
      await newUser.validate();
    } catch (validationError) {
      console.error('[REGISTER] Erreur de validation:', validationError);
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: validationError.errors 
      });
    }

    await newUser.save();
    console.log('[REGISTER] Utilisateur créé avec succès:', { username, role });

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    console.error("[REGISTER] Erreur d'inscription :", error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('[LOGIN] Tentative de connexion:', { username });

    // Vérification de l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      console.log('[LOGIN] Utilisateur introuvable:', { username });
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    // Vérification du mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('[LOGIN] Mot de passe incorrect:', { username });
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key-change-in-production',
      { expiresIn: '1h' }
    );

    console.log('[LOGIN] Connexion réussie:', { username, role: user.role });
    res.json({ token });
  } catch (error) {
    console.error("[LOGIN] Erreur de connexion:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Obtenir la liste de tous les utilisateurs
router.get('/users', verifyToken, async (req, res) => {
  try {
    console.log('[GET USERS] Récupération de la liste des utilisateurs');
    const users = await User.find().select('-password');
    console.log('[GET USERS] Nombre d\'utilisateurs trouvés:', users.length);
    res.json(users);
  } catch (err) {
    console.error("[GET USERS] Erreur:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Obtenir un utilisateur par ID
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[GET USER] Récupération utilisateur:', { id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('[GET USER] ID invalide:', { id });
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      console.log('[GET USER] Utilisateur non trouvé:', { id });
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('[GET USER] Utilisateur trouvé:', { id, username: user.username });
    res.json(user);
  } catch (err) {
    console.error("[GET USER] Erreur:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Mettre à jour un utilisateur
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;
    console.log('[UPDATE] Tentative de mise à jour:', { id, username, role });

    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('[UPDATE] ID invalide:', { id });
      return res.status(400).json({ 
        message: 'ID utilisateur invalide',
        id 
      });
    }

    // Validation des données
    if (!username) {
      console.log('[UPDATE] Nom d\'utilisateur manquant');
      return res.status(400).json({ message: 'Le nom d\'utilisateur est requis' });
    }

    // Recherche de l'utilisateur
    const user = await User.findById(id);
    if (!user) {
      console.log('[UPDATE] Utilisateur non trouvé:', { id });
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du nom d'utilisateur unique
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log('[UPDATE] Nom d\'utilisateur déjà pris:', { username });
        return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
      }
    }

    // Mise à jour des champs
    user.username = username;
    if (role) {
      user.role = role;
    }

    try {
      await user.validate();
    } catch (validationError) {
      console.error('[UPDATE] Erreur de validation:', validationError);
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: validationError.errors 
      });
    }

    // Sauvegarde
    const updatedUser = await user.save();
    console.log('[UPDATE] Utilisateur mis à jour avec succès:', {
      id: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role
    });

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error('[UPDATE] Erreur lors de la mise à jour:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ Supprimer un utilisateur
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[DELETE] Tentative de suppression utilisateur:', { id });

    // Valider l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('[DELETE] ID invalide:', { id });
      return res.status(400).json({ 
        message: 'ID utilisateur invalide',
        id 
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      console.log('[DELETE] Utilisateur non trouvé:', { id });
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé',
        id 
      });
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(id);
    console.log('[DELETE] Utilisateur supprimé avec succès:', { 
      id,
      username: user.username 
    });

    res.json({ 
      message: 'Utilisateur supprimé avec succès',
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (err) {
    console.error('[DELETE] Erreur lors de la suppression:', err);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
