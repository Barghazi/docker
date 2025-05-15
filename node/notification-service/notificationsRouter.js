const express = require('express');
const router = express.Router();
const Notification = require('./models/Notification');

// GET
router.get('/notifications', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId est requis' });
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// POST
router.post('/notifications', async (req, res) => {
  const { type, message, userId } = req.body;
  if (!type || !message || !userId) {
    return res.status(400).json({ message: 'type, message et userId sont requis' });
  }
  try {
    const newNotification = new Notification({ type, message, userId });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// DELETE
router.delete('/notifications', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId est requis' });
  try {
    await Notification.deleteMany({ userId });
    res.json({ message: 'Notifications supprimées pour cet utilisateur.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
