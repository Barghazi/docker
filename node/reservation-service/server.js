const express = require('express');
const cors = require('cors');  // Ajout de cors
const mongoose = require('mongoose');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = 5002;

// Utilisation de cors pour autoriser toutes les origines
app.use(cors());  // CORS global pour toutes les routes

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Monter les routes réservations
app.use('/reservations', reservationRoutes);

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/reservationApp')
  .then(() => {
    console.log("MongoDB connecté");
    app.listen(PORT, () => {
      console.log(`Serveur en écoute sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB", err);
  });
