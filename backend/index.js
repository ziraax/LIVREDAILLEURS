require('dotenv').config();

const cookieParser = require('cookie-parser')
const express = require('express');
const cors = require('cors');
const db = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware de parsing JSON
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001', // Update this with your frontend URL
  credentials: true // Allow credentials
}));


const authRoutes = require('./routes/auth');
const editionRoutes = require('./routes/edition');
const referentRoutes = require('./routes/referent')



app.use(authRoutes);
app.use(editionRoutes);
app.use(referentRoutes);


// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
