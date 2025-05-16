import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/ReservationForm.css';
import Notifications from './Notifications';

function ReservationForm() {
  const location = useLocation();
  const { userId, salleId } = location.state || {};

  const [formData, setFormData] = useState({
    userId: '',
    salleId: '',
    creneauId: '',
    date: '',
    heureDebut: '',
    heureFin: ''
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [availableCreneaux, setAvailableCreneaux] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const [reservations, setReservations] = useState([]);
  const [salleNom, setSalleNom] = useState('');
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [showReservations, setShowReservations] = useState(false);

  // Chargement initial
  useEffect(() => {
    const currentUserId = userId || localStorage.getItem('userId') || '';
    setFormData((prev) => ({
      ...prev,
      userId: currentUserId,
      salleId: salleId || ''
    }));

    if (salleId) {
      axios.get(`http://localhost:8000/api/salles/${salleId}`)
        .then(res => setSalleNom(res.data.nom || 'Inconnue'))
        .catch(err => console.error('Erreur nom salle', err));

      axios.get(`http://localhost:8000/api/creneaux/salle/${salleId}`)
        .then(res => {
          setCreneaux(res.data);
          const dates = [...new Set(res.data.map(c => c.date))];
          setAvailableDates(dates);
        })
        .catch(err => console.error('Erreur créneaux', err));

      if (currentUserId) {
        axios.get(`http://localhost:5002/reservations/user/${currentUserId}`)
          .then(res => setReservations(res.data))
          .catch(err => console.error('Erreur réservations', err));
      }
    }
  }, [userId, salleId]);

  // Mise à jour des créneaux
  useEffect(() => {
    if (formData.date) {
      const filtered = creneaux.filter((c) => c.date === formData.date);
      setAvailableCreneaux(filtered);
    }
  }, [formData.date, creneaux]);

  // Mise à jour des heures
  useEffect(() => {
    const selected = availableCreneaux.find((c) => c.id === parseInt(formData.creneauId));
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        heureDebut: selected.heure_debut,
        heureFin: selected.heure_fin
      }));
    }
  }, [formData.creneauId, availableCreneaux]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.creneauId) return alert('Veuillez sélectionner un créneau.');

    const payload = {
      userId: formData.userId,
      salleId: parseInt(formData.salleId),
      creneauId: parseInt(formData.creneauId),
      date: formData.date,
      heureDebut: formData.heureDebut,
      heureFin: formData.heureFin
    };

    setIsSubmitting(true);

    try {
      if (editingReservationId) {
        await axios.put(`http://localhost:5002/reservations/${editingReservationId}`, payload);
        setNotification('✅ Réservation modifiée avec succès !');
        setEditingReservationId(null);
      } else {
        await axios.post('http://localhost:5002/reservations', payload);
        setNotification('✅ Réservation effectuée !');
      }

      const updated = await axios.get(`http://localhost:5002/reservations/user/${formData.userId}`);
      setReservations(updated.data);
      setFormData((prev) => ({
        ...prev,
        creneauId: '',
        date: '',
        heureDebut: '',
        heureFin: ''
      }));
    } catch (err) {
      console.error('Erreur serveur', err.response?.data);
      setNotification(`❌ Erreur : ${err.response?.data.message || 'Voir console'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservationId(reservation._id);
    setFormData((prev) => ({
      ...prev,
      date: reservation.date,
      creneauId: reservation.creneauId.toString(),
      heureDebut: reservation.heureDebut,
      heureFin: reservation.heureFin
    }));
    setNotification('✏️ Mode modification activé');
  };

  const handleDelete = (reservationId) => {
    if (!reservationId) return console.error("ID manquant !");
    axios.delete(`http://localhost:5002/reservations/${reservationId}`)
      .then(() => {
        setReservations(prev => prev.filter(r => r._id !== reservationId));
        setNotification('🗑️ Réservation supprimée');
      })
      .catch(err => {
        console.error('Erreur suppression', err);
        setNotification('❌ Erreur lors de la suppression');
      });
  };

  return (
    <div className="reservation-form-container">
      <Notifications />
      <form onSubmit={handleSubmit} className="reservation-form">
        <h2>{editingReservationId ? 'Modifier' : 'Réserver'} {salleNom ? `la salle : ${salleNom}` : 'une salle'}</h2>

        <label>Choisir une date</label>
        <select name="date" value={formData.date} onChange={handleChange} required>
          <option value="">-- Sélectionner une date --</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>

        {formData.date && (
          <>
            <label>Choisir un créneau</label>
            <select name="creneauId" value={formData.creneauId} onChange={handleChange} required>
              <option value="">-- Sélectionner un créneau --</option>
              {availableCreneaux.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.heure_debut} → {c.heure_fin}
                </option>
              ))}
            </select>

            {formData.creneauId && (
              <>
                <p><strong>Heure Début :</strong> {formData.heureDebut}</p>
                <p><strong>Heure Fin :</strong> {formData.heureFin}</p>
              </>
            )}
          </>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : editingReservationId ? 'Modifier' : 'Valider'}
        </button>
      </form>

      {notification && <div className="notification">{notification}</div>}

      <button onClick={() => setShowReservations(!showReservations)} className="toggle-button">
        {showReservations ? 'Masquer mes réservations' : 'Afficher mes réservations'}
      </button>

      {showReservations && (
        <div className="reservations-list">
          <h3>Mes Réservations</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Créneau</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>{new Date(reservation.date).toLocaleDateString('fr-FR')}</td>
                    <td>{reservation.heureDebut} → {reservation.heureFin}</td>
                    <td>
                      <button onClick={() => handleEdit(reservation)}>Modifier</button>
                      <button onClick={() => handleDelete(reservation._id)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Aucune réservation.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReservationForm;
