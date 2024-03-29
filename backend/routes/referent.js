require('dotenv').config();

const express = require('express');
const db = require('../db/pool');
const router = express.Router();

const { authenticateUser, authorizeEtablissement, authorizeCommissionScolaire } = require('../middleware/authMiddleware')

// Route pour ajouter un nouveau référent
router.post('/referents', authenticateUser, authorizeEtablissement, async (req, res) => {
    const { nom, prenom, numTel, mail, mdp } = req.body;
    const idEtablissement = req.user.id;

    try {
        // Insérer le nouveau référent dans la table Referent
        const result = await db.query('INSERT INTO Referent (nom, prenom, numTel, mail, mdp, idEtablissement) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idRef',
            [nom, prenom, numTel, mail, mdp, idEtablissement]);
        const idRef = result.rows[0].idRef;

        res.status(201).json({ idRef, message: 'Référent ajouté avec succès' });
    } catch (error) {
        console.error('Error adding referent:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Route pour récupérer tous les référents 
router.get('/referents', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    try {
        // Récupérer tous les référents 
        const result = await db.query('SELECT * FROM Referent');
        const referents = result.rows;
        res.status(200).json({ referents });
    } catch (error) {
        console.error('Error fetching referents:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Route pour récupérer tous les référents d'un établissement
router.get('/referents/:idEtablissement', authenticateUser, authorizeEtablissement, async (req, res) => {
    const idEtablissement = req.params.idEtablissement;

    try {
        // Récupérer tous les référents associés à l'établissement spécifié
        const result = await db.query('SELECT * FROM Referent WHERE idEtablissement = $1', [idEtablissement]);
        const referents = result.rows;

        res.status(200).json({ referents });
    } catch (error) {
        console.error('Error fetching referents:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;