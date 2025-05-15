// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Salles from './pages/Salles';
import ReservationForm from './components/ReservationForm';



// import SalleList from './components/SalleList';
// import SalleForm from './components/SalleForm';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/salles" element={<Salles />} />
        
        
        <Route path="/reservations" element={< ReservationForm />} />
        { /*<Route path="/ajouter" element={<SalleForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
