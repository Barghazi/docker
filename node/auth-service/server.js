const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const authRoutes = require('./routes/auth');
const User = require('./models/User'); // ✅ n'oublie pas d'importer le modèle User
const { verifyToken, checkRole } = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);

// ✅ Route protégée : uniquement accessible au gestionnaire
app.get('/api/admin', verifyToken, checkRole('gestionnaire'), (req, res) => {
  console.log("Route /api/admin accédée");
  res.send('Contenu réservé au gestionnaire');
});

// ✅ Récupérer un utilisateur par ID (utilisé par reservation-service)
app.get('/api/auth/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur:", err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));
