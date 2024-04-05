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

// TODO : transformer en procédure
// Malheureusement j'ai tout tenté mais j'ai jamais réussi à la transformer en fonction stockée à cause du type de retour
// Route pour récupérer les ouvrages d'un auteur spécifique avec l'édition correspondante
router.get('/auteur/:idAuteur/ouvrages', authenticateUser, authorizeAuteur, async (req, res) => {
    const idAuteur = req.params.idAuteur;
    try {
        const ouvrages = await db.query(`
            SELECT o.*, e.* 
            FROM Ouvrage o 
            JOIN Ouvrage_Edition oe ON o.idOuvrage = oe.idOuvrage 
            JOIN Edition e ON oe.idEdition = e.idEdition 
            WHERE o.idOuvrage IN (SELECT idOuvrage FROM Ouvrage_Auteur WHERE idAuteur = $1)
        `, [idAuteur]);


        res.status(200).json(ouvrages.rows);
    } catch (error) {
        console.error('Error fetching ouvrages for author:', error);
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

// Route pour récupérer tous les voeux pour toutes les éditions avec les détails du référent
router.get('/voeux', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    try {
        // Récupérer tous les voeux pour toutes les éditions avec les détails du référent
        const result = await db.query(
            `SELECT Voeu.*, 
                    Referent.nom AS nomRef, Referent.prenom AS prenomRef, Referent.mail AS mailRef, Referent.numtel AS numtelRef,
                    Edition.description AS descriptionEdition, Edition.debutinscriptions, Edition.fininscriptions, 
                    Edition.debutvoeux, Edition.finvoeux, Edition.debutfestival, Edition.finfestival,
                    Etablissement.*,
                    Auteur.nom AS nomAuteur, Auteur.prenom AS prenomAuteur, Auteur.numtel AS telAuteur, Auteur.idauteur as idAuteur,
                    Ouvrage.*
            FROM Voeu
            INNER JOIN Edition ON Voeu.idEdition = Edition.idEdition
            INNER JOIN Referent ON Voeu.idRef = Referent.idRef
            INNER JOIN Etablissement ON Voeu.idEtablissement = Etablissement.idEtablissement
            INNER JOIN Ouvrage ON Voeu.idOuvrage = Ouvrage.idOuvrage
            INNER JOIN Ouvrage_Auteur ON Ouvrage.idOuvrage = Ouvrage_Auteur.idOuvrage
            INNER JOIN Auteur ON Ouvrage_Auteur.idAuteur = Auteur.idAuteur;`
        );
        const voeux = result.rows;
        
        res.status(200).json({ voeux });
    } catch (error) {
        console.error('Error fetching voeux:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour modifier l'état d'un voeu
router.post('/voeu/:idVoeu/etat', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    const idVoeu = req.params.idVoeu;
    const { etatVoeu } = req.body;

    try {
        // état du voeu est valide
        const etatsVoeuValides = ['déposé', 'validé', 'refusé'];
        if (!etatsVoeuValides.includes(etatVoeu)) {
            return res.status(400).json({ message: "L'état du voeu est invalide" });
        }

        // Mettez à jour l'état du voeu dans la base de données
        const result = await db.query(
            'UPDATE Voeu SET etat = $1 WHERE idVoeu = $2',
            [etatVoeu, idVoeu]
        );

        // Vérifiez si le voeu a été mis à jour avec succès
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Le voeu spécifié n'a pas été trouvé" });
        }

        // Répondez avec un message de succès
        res.status(200).json({ message: 'État du voeu modifié avec succès' });
    } catch (error) {
        console.error('Error updating voeu state:', error);
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
        const interventions = await db.query(`
            SELECT 
                Intervention.*,
                Auteur.nom AS nomAuteur, Auteur.prenom AS prenomAuteur,
                Interprete.nom AS nomInterprete, Interprete.prenom AS prenomInterprete,
                Accompagnateur.nom AS nomAccompagnateur, Accompagnateur.prenom AS prenomAccompagnateur,
                Edition.annee AS anneeEdition, Edition.description AS descEdition
            FROM Intervention
            LEFT JOIN Auteur ON Intervention.idAuteur = Auteur.idAuteur
            LEFT JOIN Interprete ON Intervention.idInterp = Interprete.idInterp
            LEFT JOIN Accompagnateur ON Intervention.idAcc = Accompagnateur.idAcc
            LEFT JOIN Edition ON Intervention.idEdition = Edition.idEdition
            WHERE Intervention.idEtablissement = $1 AND Intervention.idEdition = $2
        `, [idEtablissement, idEdition]);
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