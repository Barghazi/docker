import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Equipements.css';

const Equipements = () => {
  const [equipements, setEquipements] = useState([]);
  const [newEquipement, setNewEquipement] = useState({ nom: '' });
  const [message, setMessage] = useState('');

  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Configure axios defaults
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipements');
      setEquipements(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Session expirée. Veuillez vous reconnecter.');
        // Optionally redirect to login page
        // window.location.href = '/';
      } else {
        setMessage('Erreur lors du chargement des équipements');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/equipements', newEquipement);
      setNewEquipement({ nom: '' });
      fetchEquipements();
      setMessage('Équipement ajouté avec succès');
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Session expirée. Veuillez vous reconnecter.');
        // Optionally redirect to login page
        // window.location.href = '/';
      } else {
        setMessage('Erreur lors de l\'ajout de l\'équipement');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/equipements/${id}`);
      fetchEquipements();
      setMessage('Équipement supprimé avec succès');
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Session expirée. Veuillez vous reconnecter.');
        // Optionally redirect to login page
        // window.location.href = '/';
      } else {
        setMessage('Erreur lors de la suppression de l\'équipement');
      }
    }
  };

  return (
    <div className="equipements-container">
      <h1>Gestion des Équipements</h1>
      
      <div className="equipement-form-container">
        <div className="equipement-input-group">
          <input
            type="text"
            value={newEquipement.nom}
            onChange={(e) => setNewEquipement({ nom: e.target.value })}
            placeholder="Nom de l'équipement"
            required
          />
        </div>
        <div className="equipement-button-group">
          <button 
            type="button" 
            onClick={handleSubmit}
            className="add-button"
          >
            Ajouter un équipement
          </button>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="equipements-list">
        {equipements.map((equipement) => (
          <div key={equipement.id} className="equipement-item">
            <span>{equipement.nom}</span>
            <button onClick={() => handleDelete(equipement.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipements; 