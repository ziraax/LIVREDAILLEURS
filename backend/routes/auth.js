require('dotenv').config();

const express = require('express');
const db = require('../db/pool');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;

// Route pour l'inscription des auteurs
router.post('/register/auteur', async (req, res) => {
    const { identifiant, mdp, nom, prenom, num_tel, mail, adresse, localisation, langues } = req.body;
    try {
        // Hasher le mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(mdp, saltRounds);

        // Insérer l'auteur dans la base de données
        await db.query('CALL sp_insert_auteur($1, $2, $3, $4, $5, $6, $7, $8, $9)', [identifiant, hashedPassword, nom, prenom, num_tel, mail, adresse, localisation, langues]);

        // Répondre avec un message de succès
        res.status(201).json({ message: 'Auteur inscrit avec succès' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
  
// Route pour le login des auteurs
router.post('/login/auteur', async (req, res) => {
    const { identifiant, mdp } = req.body;
    try {
        // Récupérer l'auteur correspondant à l'identifiant
        const result = await db.query('SELECT * FROM Auteur WHERE identifiant = $1', [identifiant]);

        // Vérifier si l'auteur existe
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Auteur non trouvé' });
        }

        // Récupérer les données de l'auteur
        const auteur = result.rows[0];

        // Vérifier si le mot de passe est correct en comparant avec le hash stocké
        const passwordMatch = await bcrypt.compare(mdp, auteur.mdp);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Créer un token JWT pour l'auteur
        const token = jwt.sign({ id: auteur.idAuteur, role: 'auteur' }, jwtSecret);

        // Répondre avec le token JWT
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict'}).sendStatus(200);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

//Route pour l'inscription des établissements
router.post('/register/etablissement', async (req, res) => {
    const { identifiant, mdp, nom, type, num_tel, mail, adresse, localisation } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mdp, saltRounds)
        await db.query('CALL sp_insert_etablissement($1, $2, $3, $4, $5, $6, $7, $8)', [identifiant, hashedPassword, nom, type, num_tel, mail, adresse, localisation]);
        res.status(201).json({message: 'Etablissement inscrit avec succès' });
    } catch (error) {
        console.error('Error during registration of etablissement', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

//Route pour le login des établissements
router.post('/login/etablissement', async (req, res) => {
    const { identifiant, mdp } = req.body;
    try {
        const result = await db.query('SELECT * FROM Etablissement WHERE identifiant = $1', [identifiant]);
        if (result.rows.length === 0 ) {
            return res.status(404).json({ message : 'Etablissement non trouvé' });
        }
        const etablissement = result.rows[0];
        const passwordMatch = await bcrypt.compare(mdp, etablissement.mdp);
        if(!passwordMatch) {
            return res.status(401).json({ message : 'Mot de passe incorrect' });
        }
        const token = jwt.sign({ id: etablissement.idEtablissement, role: 'etablissement' }, jwtSecret);
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict'}).sendStatus(200);
    } catch (error) {
        console.error('Error during login of etablissement', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour l'inscription de la commission scolaire
router.post('/register/commission-scolaire', async (req, res) => {
    const { identifiant, mdp, mail, prenom_resp, nom_resp, num_tel, adresse } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mdp, saltRounds);
        await db.query('CALL sp_insert_commission_scolaire($1, $2, $3, $4, $5, $6, $7)', [identifiant, hashedPassword, mail, prenom_resp, nom_resp, num_tel, adresse]);
        res.status(201).json({ message: 'Commission scolaire inscrite avec succès' });
    } catch (error) {
        console.error('Error during registration of commission scolaire:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour l'authentification de la commission scolaire
router.post('/login/commission-scolaire', async (req, res) => {
    const { identifiant, mdp } = req.body;
    try {
        const result = await db.query('SELECT * FROM CommissionScolaire WHERE identifiant = $1', [identifiant]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Commission scolaire non trouvée' });
        }
        const commissionScolaire = result.rows[0];
        const passwordMatch = await bcrypt.compare(mdp, commissionScolaire.mdp);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        const token = jwt.sign({ id: commissionScolaire.idCommission, role: 'commission-scolaire' }, jwtSecret);
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict'}).sendStatus(200);
    } catch (error) {
        console.error('Error during login of commission scolaire:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour la déconnexion
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
});


module.exports = router;