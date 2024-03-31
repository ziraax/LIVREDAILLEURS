require('dotenv').config();

const express = require('express');
const db = require('../db/pool');
const router = express.Router();


const { authenticateUser, authorizeCommissionScolaire, authorizeAuteur, authorizeEtablissement} = require('../middleware/authMiddleware')

// Route pour get toutes les editions
router.get('/edition', async (req, res) => {
    try {
        const editions = await db.query('SELECT * FROM Edition');
        res.json(editions.rows)
    } catch (error) {
        console.error('Error fetching editions :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
})

// Route pour inserer une edition
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

// Route pour proposer un ouvrage
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

// Route pour obtenir tous les ouvrages d'une edition
router.get('/edition/:idEdition/ouvrages', async (req, res) => {
    const idEdition = req.params.idEdition;

    try {
        const result = await db.query('SELECT get_ouvrages_by_edition($1)', [idEdition]);

        // Vérifier si la fonction stockée a renvoyé des données
        if (result.rowCount > 0) {
            // Répondre avec les ouvrages au format JSON
            res.status(200).json({ ouvrages: result.rows[0].get_ouvrages_by_edition });
        } else {
            res.status(404).json({ message: 'Aucun résultat trouvé pour cette édition' });
        }
    } catch (error) {
        console.error('Error fetching ouvrages:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Route pour soumettre un nouveau voeu pour une édition
router.post('/edition/:idEdition/etablissement/:idEtablissement/voeux', authenticateUser, authorizeEtablissement, async (req, res) => {
    const idEtablissement = req.params.idEtablissement;
    const idEdition = req.params.idEdition;
    const { idOuvrage, idRef, prio } = req.body;

    try {
        // Insérer le nouveau voeu dans la table Voeu
        const result = await db.query(
            'INSERT INTO Voeu (prio, idEtablissement, idOuvrage, idRef, idEdition) VALUES ($1, $2, $3, $4, $5) RETURNING idVoeu',
            [prio, idEtablissement, idOuvrage, idRef, idEdition]
        );
        
        const idVoeu = result.rows[0].idVoeu;

        res.status(201).json({ message: 'Voeu soumis avec succès', idVoeu });
    } catch (error) {
        console.error('Error submitting voeu:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour créer une intervention en tant que commission scolaire
router.post('/edition/:idEdition/interventions', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    const idEdition = req.params.idEdition;
    const { etatInterv, dateInterv, hDebut, hFin, nbEleves, idAuteur, idInterp, idAcc, idEtablissement } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO Intervention (etatInterv, dateInterv, hDebut, hFin, nbEleves, idAuteur, idInterp, idAcc, idEdition, idEtablissement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING idInterv',
            [etatInterv, dateInterv, hDebut, hFin, nbEleves, idAuteur, idInterp, idAcc, idEdition, idEtablissement]
        );

        const idInterv = result.rows[0].idInterv;
        res.status(201).json({ message: 'Intervention créée avec succès', idInterv });
    } catch (error) {
        console.error('Error creating intervention:', error);
        res.status(500).json({ message: 'Erreur serveur' })
    }

});


// Route pour recuperer les interventions d'un établissement dans une édition donnée
router.get('/edition/:idEdition/etablissements/:idEtablissement/interventions', authenticateUser, authorizeEtablissement, async (req, res) => {
    const idEtablissement = req.params.idEtablissement;
    const idEdition = req.params.idEdition;
    try {
        const interventions = await db.query('SELECT * FROM Intervention WHERE idEtablissement = $1 and idEdition = $2', [idEtablissement, idEdition]);
        res.status(200).json({ interventions: interventions.rows });
    } catch (error) {
        console.error('Error fetching interventions for establishment:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Route pour recuperer toutes les interventions d'une edition
router.get('/edition/:idEdition/interventions', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    const idEdition = req.params.idEdition;
    try {
        const interventions = await db.query('SELECT * FROM Intervention WHERE idEdition = $1', [idEdition]);
        res.status(200).json({ interventions: interventions.rows });
    } catch (error) {
        console.error('Error fetching all interventions:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;