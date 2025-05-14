import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ correct

import './Auth.css'; // tu peux créer ce fichier pour styliser

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Faire la requête de connexion
      const res = await login(formData);
      
      // Stocker le token dans localStorage
      const token = res.data.token;
      localStorage.setItem('token', token);
      
      // Décoder le token
      const decoded = jwtDecode(token);
      console.log(decoded.id); // ou decoded.userId selon ton token

      // Stocker userId dans localStorage
      localStorage.setItem('userId', decoded.id);
      setMessage('Connexion réussie');

      // Décoder le rôle
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      // Redirection en fonction du rôle
      if (role === 'gestionnaire') {
        navigate('/ajouter');
      } else {
        navigate('/salles');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Connexion</h2>
        <input
          name="username"
          placeholder="Nom d'utilisateur"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          required
        />
        <button type="submit">Se connecter</button>
        <p className="message">{message}</p>
        <p className="switch">
          Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
