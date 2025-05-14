const axios = require('axios');
const { SALLE_SERVICE_URL } = process.env;

exports.isCreneauOccupe = async (salleId, date, heureDebut, heureFin) => {
  try {
    const res = await axios.post(`${SALLE_SERVICE_URL}/salles-recherche`, {
      salle_id: salleId,
      date,
      heure_debut: heureDebut,
      heure_fin: heureFin
    });

    return res.data.length > 0;
  } catch (err) {
    console.error("Erreur API Laravel :", err.message);
    return true;
  }
};
