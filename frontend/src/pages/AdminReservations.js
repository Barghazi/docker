import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import { FaTrash, FaCheck } from 'react-icons/fa';
import '../styles/AdminReservations.css';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setReservations(response.data);
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response) {
        setError(err.response.data.message || 'Erreur lors du chargement des réservations');
      } else if (err.request) {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      } else {
        setError('Une erreur est survenue lors du chargement des réservations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reservations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Réservation supprimée avec succès');
      fetchReservations();
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response) {
        setError(err.response.data.message || 'Erreur lors de la suppression de la réservation');
      } else if (err.request) {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      } else {
        setError('Une erreur est survenue lors de la suppression de la réservation');
      }
    }
  };

  const handleValidate = async (reservation) => {
    if (!window.confirm('Êtes-vous sûr de vouloir valider cette réservation ?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/reservations/${reservation.id}`, {
        statut: 'confirmee',
        date: reservation.date,
        heure_debut: reservation.heure_debut,
        heure_fin: reservation.heure_fin,
        user_id: reservation.user_id,
        salle_id: reservation.salle_id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Réservation validée avec succès');
      fetchReservations();
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response) {
        const errorMessage = err.response.data.message || 'Erreur lors de la validation de la réservation';
        const validationErrors = err.response.data.errors;
        if (validationErrors) {
          setError(`${errorMessage}: ${Object.values(validationErrors).flat().join(', ')}`);
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      } else {
        setError('Une erreur est survenue lors de la validation de la réservation');
      }
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="admin-reservations">
      <h2>Validation des Réservations</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Utilisateur</th>
            <th>Salle</th>
            <th>Date</th>
            <th>Heure Début</th>
            <th>Heure Fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.user?.name}</td>
              <td>{reservation.salle?.nom}</td>
              <td>{new Date(reservation.date).toLocaleDateString()}</td>
              <td>{reservation.heure_debut}</td>
              <td>{reservation.heure_fin}</td>
              <td>{reservation.statut}</td>
              <td>
                {reservation.statut === 'en_attente' && (
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleValidate(reservation)}
                  >
                    <FaCheck className="me-1" /> Valider
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(reservation.id)}
                >
                  <FaTrash className="me-1" /> Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminReservations; 