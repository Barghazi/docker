const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

// ✅ Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur existe déjà' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    console.error("Erreur d'inscription :", error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification de l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    // Vérification du mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erreur de connexion :", error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Obtenir un utilisateur par ID (utilisé par d'autres services comme reservation-service)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    console.error("Erreur serveur :", err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
