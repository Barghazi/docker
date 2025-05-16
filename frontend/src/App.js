// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Salles from './pages/Salles';
import ReservationForm from './components/ReservationForm';
import Equipements from './pages/Equipements';
import AdminSalles from './pages/AdminSalles';
import Users from './pages/Users';



// import SalleList from './components/SalleList';
// import SalleForm from './components/SalleForm';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/salles" element={<Salles />} />
        <Route path="/equipements" element={< Equipements />} />
        <Route path="/admin/salles" element={< AdminSalles />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reservations" element={< ReservationForm />} />
        { /*<Route path="/admin" element={<SalleForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
