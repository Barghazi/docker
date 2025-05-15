const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const startConsumer = require('./rabbitmqConsumer');
const notificationsRouter = require('./notificationsRouter'); // Assure-toi que ce fichier existe !

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/notifications_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

startConsumer();

app.use('/api', notificationsRouter);

app.listen(PORT, () => {
  console.log(`🚀 API notifications lancée sur http://localhost:${PORT}`);
});
