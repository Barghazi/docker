import React, { useEffect, useState } from 'react';
import { getSalles, searchSalles, getTypes } from '../services/salleService';
import '../styles/Salles.css';
import SalleCard from '../components/SalleCard';

const PageSalles = () => {
  const [salles, setSalles] = useState([]);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchSalles();
    fetchTypes();
  }, []);

  const fetchSalles = async () => {
    try {
      const res = await getSalles();
      setSalles(res.data);
      setVisibleCount(6);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await getTypes();
      setTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    console.log("Filtrage avec :", { type, date, heureDebut, heureFin });

    try {
      const res = await searchSalles(type, date, heureDebut, heureFin);
      console.log('Réponse de l\'API:', res.data);
      setSalles(res.data);
      setVisibleCount(6);
    } catch (err) {
      console.error('Erreur lors de la recherche des salles', err);
    }
  };

  const handleReserve = (salle) => {
    alert(`Réservation de la salle : ${salle.nom}`);
  };

  return (
    <div className="page-salles-container">
      <h2 className="page-salles-title">🔍 Recherche de Salles</h2>

      <div className="filter-container">
        <div>
          <label>Type :</label><br />
          <select className="filter-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">-- Tous les types --</option>
            {types.map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Date :</label><br />
          <input
            className="filter-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Heure Début :</label><br />
          <input
            className="filter-input"
            type="time"
            value={heureDebut}
            onChange={(e) => setHeureDebut(e.target.value)}
          />
        </div>

        <div>
          <label>Heure Fin :</label><br />
          <input
            className="filter-input"
            type="time"
            value={heureFin}
            onChange={(e) => setHeureFin(e.target.value)}
          />
        </div>

        <div style={{ alignSelf: 'flex-end' }}>
          <button className="filter-button" onClick={handleSearch}>
            Filtrer
          </button>
        </div>
      </div>

      <div className="salles-container">
        {salles.slice(0, visibleCount).map((salle) => (
          <SalleCard key={salle.id} salle={salle} onReserve={handleReserve} />
        ))}
      </div>

      {visibleCount < salles.length && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button className="filter-button" onClick={() => setVisibleCount(visibleCount + 6)}>
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

export default PageSalles;
