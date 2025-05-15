import React, { useEffect, useState } from "react";

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Récupérer le userId depuis localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/api/notifications?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des notifications...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <button onClick={() => setShowNotifications(!showNotifications)}>
        Notifications ({notifications.length})
      </button>

      {showNotifications && (
        <ul>
          {notifications.length === 0 ? (
            <li>Aucune notification pour le moment.</li>
          ) : (
            notifications.map((notif) => (
              <li key={notif._id}>{notif.message}</li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default NotificationsList;
