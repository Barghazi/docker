const express = require('express');
const mongoose = require('mongoose');
const reservationRoutes = require('./routes/reservationRoutes');
const app = express();
const PORT = 5002;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Monter les routes réservations
app.use('/reservations', reservationRoutes);

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/reservationApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connecté");
    app.listen(PORT, () => {
      console.log(`Serveur en écoute sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB", err);
  });
