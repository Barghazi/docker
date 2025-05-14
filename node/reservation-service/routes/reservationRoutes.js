const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');

// Route POST pour créer une réservation
router.post('/', async (req, res) => {
  try {
    const { userId, salleId, creneauId, date, heureDebut, heureFin } = req.body;

    // Créer une nouvelle réservation
    const newReservation = new Reservation({
      userId,
      salleId,
      creneauId,
      date,
      heureDebut,
      heureFin,
    });

    // Enregistrer dans la base de données
    await newReservation.save();

    res.status(201).json({ message: 'Réservation enregistrée dans MongoDB' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error });
  }
});
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
  }
});


module.exports = router;
