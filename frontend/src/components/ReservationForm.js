import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReservationForm.css';

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

  const [creneaux, setCreneaux] = useState([]);

  useEffect(() => {
    const currentUserId = userId || localStorage.getItem('userId') || '';

    setFormData((prev) => ({
      ...prev,
      userId: currentUserId,
      salleId: salleId || ''
    }));

    if (salleId) {
      axios
        .get(`http://localhost:8000/api/creneaux/salle/${salleId}`)
        .then((res) => setCreneaux(res.data))
        .catch((err) => console.error('Erreur chargement créneaux :', err));
    }
  }, [userId, salleId]);

  useEffect(() => {
    const selectedId = parseInt(formData.creneauId);
    if (!isNaN(selectedId)) {
      const selected = creneaux.find((c) => c.id === selectedId);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          date: selected.date,
          heureDebut: selected.heure_debut,
          heureFin: selected.heure_fin
        }));
      }
    }
  }, [formData.creneauId, creneaux]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    salleId: Number(formData.salleId),
    creneauId: Number(formData.creneauId)
  };

  try {
    const response = await axios.post('http://localhost:5002/reservations', payload);
    console.log('Réservation réussie:', response.data);
    alert('✅ Réservation effectuée !');
  } catch (err) {
    console.error('Erreur lors de la réservation:', err.response ? err.response.data : err.message);
    alert('❌ Erreur lors de la réservation');
  }
};


  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <h2>Réserver une salle</h2>

      <label>User ID</label>
      <input name="userId" value={formData.userId} disabled />

      <label>Salle ID</label>
      <input name="salleId" value={formData.salleId} disabled />

      <label>Choisir un créneau</label>
      <select
        name="creneauId"
        value={formData.creneauId}
        onChange={handleChange}
        required
      >
        <option value="">-- Sélectionner un créneau --</option>
        {creneaux.map((c) => (
          <option key={c.id} value={c.id}>
            {c.date} | {c.heure_debut} → {c.heure_fin}
          </option>
        ))}
      </select>

      {formData.creneauId && (
        <>
          <p><strong>Date :</strong> {formData.date}</p>
          <p><strong>Heure Début :</strong> {formData.heureDebut}</p>
          <p><strong>Heure Fin :</strong> {formData.heureFin}</p>
        </>
      )}

      <button type="submit" style={{ marginTop: '10px' }}>Valider</button>
    </form>
  );
}

export default ReservationForm;
