const Reservation = require('../models/reservation');
const axios = require('axios');

async function creerReservation(req, res) {
  const { userId, salleId, date, heureDebut, heureFin, creneauId } = req.body;

  try {
    // Vérifier si le créneau est encore disponible en faisant une requête à l'API Laravel
    const response = await axios.get(`http://localhost:8000/api/creneaux/${creneauId}`);
    const creneau = response.data;

    if (!creneau || creneau.disponible) {
      return res.status(400).json({ message: 'Créneau déjà réservé ou invalide.' });
    }

    // Créer la réservation dans MongoDB
    const reservation = new Reservation({
      userId,
      salleId,
      date,
      heureDebut,
      heureFin,
      creneauId: creneauId || null, // Si le creneauId est fourni, l'ajouter
    });

    // Sauvegarder la réservation
    await reservation.save();

    // Mettre à jour la disponibilité du créneau dans Laravel
    await axios.post('http://localhost:8000/api/creneaux/reserver', { creneau_id: creneauId });

    return res.status(201).json({ message: 'Réservation effectuée avec succès', reservation });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la réservation' });
  }
}

module.exports = { creerReservation };
