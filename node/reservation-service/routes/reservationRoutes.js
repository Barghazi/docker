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

// Route GET pour récupérer toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
  }
});

// Route GET pour récupérer une réservation par ID
// Route GET pour récupérer des réservations par userId
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Recherche de toutes les réservations pour un utilisateur donné
    const reservations = await Reservation.find({ userId: userId });

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'Aucune réservation trouvée pour cet utilisateur' });
    }

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});
// Route DELETE pour supprimer une réservation par ID
router.delete('/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
});
// Route PUT pour modifier une réservation par ID
router.put('/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const updateData = req.body; // Contient les champs à mettre à jour

    // Trouver la réservation et la mettre à jour
    const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, updateData, { new: true });

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation modifiée avec succès', updatedReservation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification', error });
  }
});


module.exports = router;
