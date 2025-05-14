import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getSalles = () => axios.get(`${API_URL}/salles`);
export const getSalle = (id) => axios.get(`${API_URL}/salles/${id}`);
export const createSalle = (data) => axios.post(`${API_URL}/salles`, data);
export const updateSalle = (id, data) => axios.put(`${API_URL}/salles/${id}`, data);
export const deleteSalle = (id) => axios.delete(`${API_URL}/salles/${id}`);
export const searchSalles = (type, date, heureDebut, heureFin) => {
  return axios.get('http://localhost:8000/api/salles-recherche', {
    params: {
      type,
      date,
      heure_debut: heureDebut,
      heure_fin: heureFin
    }
  });
};

export const getTypes = () =>  axios.get(`${API_URL}/types`);

