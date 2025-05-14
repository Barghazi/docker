import React from 'react';
import '../styles/SalleCard.css';
import { useNavigate } from 'react-router-dom';




const SalleCard = ({ salle, onReserve }) => {
    const imageUrl = `http://localhost:8000/${salle.image}`;
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
  const creneauId = 1; // Par exemple, tu peux aussi le passer dynamiquement
     
  
  

  const handleReservation = () => {
    navigate('/reservations', {
      state: {
        userId,
        salleId: salle.id,
        creneauId
      }
    });
  };

  return (
    <div className="salle-card">
     <img src={imageUrl} alt={salle.nom} className="card-image" />
      <h3>{salle.nom}</h3>
      <p><strong>Type :</strong> {salle.type}</p>
      <p><strong>Capacité :</strong> {salle.capacité}</p>
      <p><strong>Équipements :</strong> {salle.équipement}</p>
      <p><strong>Localisation :</strong> {salle.localisation}</p>
      <button className="reserve-button" onClick={handleReservation}>
        Réserver
      </button>
    </div>
  );
};

export default SalleCard;
