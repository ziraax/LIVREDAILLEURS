require('dotenv').config();

const cookieParser = require('cookie-parser')
const express = require('express');
const db = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware de parsing JSON
app.use(cookieParser());

const authRoutes = require('./routes/auth');
const editionRoutes = require('./routes/edition');
app.use(authRoutes);
app.use(editionRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
