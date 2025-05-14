// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  salleId: { type: Number, required: true },
  creneauId: { type: Number },
  date: { type: Date, required: true },
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
