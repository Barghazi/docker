import React, { useState } from 'react';
import { createSalle } from '../services/salleService';

const SalleForm = () => {
  const [form, setForm] = useState({
    nom: '',
    type: '',
    capacité: '',
    équipement: '',
    localisation: ''
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSalle(form);
    alert('Salle ajoutée');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nom" placeholder="Nom" onChange={handleChange} />
      <input name="type" placeholder="Type" onChange={handleChange} />
      <input name="capacité" placeholder="Capacité" onChange={handleChange} />
      <input name="équipement" placeholder="Équipement" onChange={handleChange} />
      <input name="localisation" placeholder="Localisation" onChange={handleChange} />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default SalleForm;
