const Reservation = require('../models/reservation');
const axios = require('axios');

async function creerReservation(req, res) {
  const { userId, salleId, date, heureDebut, heureFin, creneauId } = req.body;

  try {
    // Vérifier si le créneau est disponible dans Laravel
    const response = await axios.get(`http://localhost:8000/api/creneaux/${creneauId}`);
    const creneau = response.data;

    if (!creneau || !creneau.disponible) {
      return res.status(400).json({ message: 'Créneau déjà réservé ou invalide.' });
    }

    // Vérifier s’il y a une réservation existante avec ce créneau
    const reservationExistante = await Reservation.findOne({
      date,
      salleId,
      creneauId
    });

    if (reservationExistante) {
      return res.status(400).json({ message: 'Une réservation existe déjà pour ce créneau.' });
    }

    // Vérifier le chevauchement horaire
    const chevauchement = await Reservation.findOne({
      salleId,
      date,
      $or: [
        { heureDebut: { $lt: heureFin }, heureFin: { $gt: heureDebut } }
      ]
    });

    if (chevauchement) {
      return res.status(400).json({ message: 'Ce créneau chevauche une réservation existante.' });
    }

    // Enregistrer la réservation
    const reservation = new Reservation({
      userId,
      salleId,
      date,
      heureDebut,
      heureFin,
      creneauId
    });

    await reservation.save();

    // Marquer le créneau comme réservé dans Laravel
    await axios.post('http://localhost:8000/api/creneaux/reserver', {
      creneau_id: creneauId
    });

    return res.status(201).json({ message: 'Réservation effectuée avec succès.', reservation });

  } catch (error) {
    console.error('Erreur lors de la réservation :', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la réservation.' });
  }
}

module.exports = { creerReservation };
