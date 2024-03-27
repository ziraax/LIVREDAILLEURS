require('dotenv').config();

const express = require('express');
const db = require('../db/pool');
const router = express.Router();


const { authenticateUser, authorizeCommissionScolaire, authorizeAuteur} = require('../middleware/authMiddleware')

router.get('/edition', async (req, res) => {
    try {
        const editions = await db.query('SELECT * FROM Edition');
        res.json(editions.rows)
    } catch (error) {
        console.error('Error fetching editions :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
})

router.post('/edition', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    const { annee, description, debutInscriptions, finInscriptions, debutVoeux, finVoeux, debutFestival, finFestival } = req.body;
    const idCommission = req.user.id;

    try {
        await db.query('CALL sp_insert_edition($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [annee, description, debutInscriptions, finInscriptions, debutVoeux, finVoeux, debutFestival, finFestival, idCommission]
        );
        res.status(201).json({ message: 'Édition créée avec succès' });
    } catch (error) {
        console.error('Error creating edition:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/edition/:idEdition/ouvrage', authenticateUser, authorizeAuteur, async (req, res) => {
    const { titre, classesConcernees, publicsCibles, description, langue } = req.body;
    const idAuteur = req.user.id; // Récupérer l'ID de l'auteur à partir du token JWT
    const idEdition = req.params.idEdition;

    try {
        // Appel de la procédure stockée pour proposer l'ouvrage
        const result = await db.query('CALL sp_proposer_ouvrage($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [titre, classesConcernees, publicsCibles, description, langue, idEdition, idAuteur, false, '']);

        // Vérification du résultat de la procédure stockée
        if (result.rows[0].p_success) {
            res.status(201).json({ message: result.rows[0].p_message });
        } else {
            res.status(500).json({ message: result.rows[0].p_message });
        }
    } catch (error) {
        console.error('Error proposing ouvrage:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



module.exports = router;