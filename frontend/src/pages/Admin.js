import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaUsers, FaTools, FaDoorOpen, FaCalendarAlt } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h1>Administration</h1>
      <div className="admin-buttons">
        <Button 
          variant="primary" 
          className="admin-button"
          onClick={() => navigate('/users')}
        >
          <FaUsers /> Gérer les Utilisateurs
        </Button>
        
        <Button 
          variant="success" 
          className="admin-button"
          onClick={() => navigate('/equipements')}
        >
          <FaTools /> Gérer les Équipements
        </Button>

        <Button 
          variant="info" 
          className="admin-button"
          onClick={() => navigate('/admin/salles')}
        >
          <FaDoorOpen /> Gérer les Salles
        </Button>

        <Button 
          variant="warning" 
          className="admin-button"
          onClick={() => navigate('/admin/reservations')}
        >
          <FaCalendarAlt /> Gérer les Réservations
        </Button>
      </div>
    </div>
  );
};

export default Admin; 