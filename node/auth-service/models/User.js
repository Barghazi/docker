const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['utilisateur', 'gestionnaire'], default: 'utilisateur' }
});

module.exports = mongoose.model('User', userSchema);
