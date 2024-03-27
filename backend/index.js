require('dotenv').config();

const express = require('express');
const db = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware de parsing JSON

const authRoutes = require('./routes/auth')
app.use(authRoutes)

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
