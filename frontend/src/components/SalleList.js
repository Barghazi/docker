import React, { useEffect, useState } from 'react';
import { getSalles, deleteSalle } from '../services/salleService';

const SalleList = () => {
  const [salles, setSalles] = useState([]);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    const res = await getSalles();
    setSalles(res.data);
  };

  const handleDelete = async (id) => {
    await deleteSalle(id);
    fetchSalles();
  };

  return (
    <div>
      <h2>Liste des Salles</h2>
      <ul>
        {salles.map((salle) => (
          <li key={salle.id}>
            {salle.nom} | {salle.type} | {salle.capacité} places
            <button onClick={() => handleDelete(salle.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalleList;
