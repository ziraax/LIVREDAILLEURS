require('dotenv').config();

const express = require('express');
const db = require('../db/pool');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;

const { authenticateUser, authorizeCommissionScolaire } = require('../middleware/authMiddleware')

router.get('/editions', async (req, res) => {
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
    try {
        await db.query('CALL sp_insert_edition($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [annee, description, debutInscriptions, finInscriptions, debutVoeux, finVoeux, debutFestival, finFestival, req.user.id]
        );
        res.status(201).json({ message: 'Édition créée avec succès' });
    } catch (error) {
        console.error('Error creating edition:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;