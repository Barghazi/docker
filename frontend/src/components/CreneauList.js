import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreneauList = ({ salleId }) => {
  const [creneaux, setCreneaux] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/creneaux/salle/${salleId}`)
      .then((res) => setCreneaux(res.data));
  }, [salleId]);

  return (
    <ul>
      {creneaux.map((c) => (
        <li key={c.id}>{c.date} - {c.heure_début} à {c.heure_fin}</li>
      ))}
    </ul>
  );
};

export default CreneauList;
