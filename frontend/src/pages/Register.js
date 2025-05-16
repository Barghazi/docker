// src/pages/Register.js
import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'utilisateur' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Inscription réussie');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Inscription</h2>
        <input name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="utilisateur">Utilisateur</option>
          <option value="gestionnaire">Gestionnaire</option>
        </select>
        <button type="submit">S'inscrire</button>
        <p className="switch">
          Déjà inscrit ? <Link to="/">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
