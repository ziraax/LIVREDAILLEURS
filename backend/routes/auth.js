require('dotenv').config();

const express = require('express');
const db = require('../db/pool');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;

const { authenticateUser, authorizeCommissionScolaire, authorizeAuteur, authorizeEtablissement} = require('../middleware/authMiddleware')


//Route pour check l'user id et return les user info
router.get('/auth/check', authenticateUser, (req, res) => {
    res.status(200).json({ id: req.user.id, role: req.user.role })
})

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
        const token = jwt.sign({ id: auteur.idauteur, role: 'auteur' }, jwtSecret);

        // Répondre avec le token JWT
        res.cookie('token', token, { httpOnly: false, sameSite: 'Lax' }).json({ idauteur : auteur.idauteur });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route to get information of an establishment
router.get('/auteur/:id', async (req, res) => {
    const auteurId = req.params.id; // Parse the string ID to an integer
    
    // Check if etablissementId is a valid integer
    if (isNaN(auteurId)) {
        return res.status(400).json({ message: 'Invalid etablissement ID' });
    }

    try {
        // Fetch establishment information from the database
        const result = await db.query('SELECT * FROM Auteur WHERE idauteur = $1', [auteurId]);

        // Check if establishment exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Etablissement not found' });
        }

        // Send establishment information as response
        const etablissement = result.rows[0];
        res.status(200).json(etablissement);
    } catch (error) {
        console.error('Error fetching establishment information:', error);
        res.status(500).json({ message: 'Internal server error' });
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

        const token = jwt.sign({ id: etablissement.idetablissement, role: 'etablissement' }, jwtSecret);
        res.cookie('token', token, { httpOnly: false, sameSite: 'Lax'}).json({ idetablissement : etablissement.idetablissement });
    } catch (error) {
        console.error('Error during login of etablissement', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route to get information of an establishment
router.get('/etablissement/:id', async (req, res) => {
    const etablissementId = req.params.id; // Parse the string ID to an integer
    
    // Check if etablissementId is a valid integer
    if (isNaN(etablissementId)) {
        return res.status(400).json({ message: 'Invalid etablissement ID' });
    }

    try {
        // Fetch establishment information from the database
        const result = await db.query('SELECT * FROM Etablissement WHERE idetablissement = $1', [etablissementId]);

        // Check if establishment exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Etablissement not found' });
        }

        // Send establishment information as response
        const etablissement = result.rows[0];
        res.status(200).json(etablissement);
    } catch (error) {
        console.error('Error fetching establishment information:', error);
        res.status(500).json({ message: 'Internal server error' });
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
        const token = jwt.sign({ id: commissionScolaire.idcommission, role: 'commission-scolaire' }, jwtSecret);
        res.cookie('token', token, { httpOnly: false, sameSite: 'Lax'}).json({ idcommission : commissionScolaire.idcommission });
    } catch (error) {
        console.error('Error during login of commission scolaire:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour obtenir les informations sur une commission scolaire
router.get('/commission-scolaire/:id', async (req, res) => {
    const commissionid = req.params.id; // Parse the string ID to an integer
    
    // Check if etablissementId is a valid integer
    if (isNaN(commissionid)) {
        return res.status(400).json({ message: 'Invalid etablissement ID' });
    }

    try {
        // Fetch establishment information from the database
        const result = await db.query('SELECT * FROM CommissionScolaire WHERE idcommission = $1', [commissionid]);

        // Check if establishment exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Commission not found' });
        }

        // Send establishment information as response
        const etablissement = result.rows[0];
        res.status(200).json(etablissement);
    } catch (error) {
        console.error('Error fetching commission information:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route pour l'inscription d'un nouvel interprète
router.post('/register/interprete', async (req, res) => {
    const { nom, prenom, numTel, mail, mdp, langueSource, langueCible } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mdp, saltRounds);
        await db.query('CALL sp_insert_interprete($1, $2, $3, $4, $5, $6, $7)', [nom, prenom, numTel, mail, hashedPassword, langueSource, langueCible]);
        res.status(201).json({ message: 'Interprète inscrit avec succès' });
    } catch (error) {
        console.error('Error during registration of interprete:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Route pour l'authentification d'un interprète
router.post('/login/interprete', async (req, res) => {
    const { mail, mdp } = req.body;

    try {
        // Récupérer l'interprète par son email
        const result = await db.query('SELECT * FROM Interprete WHERE mail = $1', [mail]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Interprète non trouvé' });
        }
        const interprete = result.rows[0];

        const passwordMatch = await bcrypt.compare(mdp, interprete.mdp);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: interprete.idinterp, role: 'interprete' }, jwtSecret);
        res.cookie('token', token, { httpOnly: false, sameSite: 'Lax' }).json({ idinterprete : interprete.idinterp });
    } catch (error) {
        console.error('Error during login of interprete:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour l'inscription d'un nouvel accompagnateur
router.post('/register/accompagnateur', async (req, res) => {
    const { nom, prenom, numTel, mail, mdp } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mdp, saltRounds);
        await db.query('CALL sp_insert_accompagnateur($1, $2, $3, $4, $5)', [nom, prenom, numTel, mail, hashedPassword]);
        res.status(201).json({ message: 'Accompagnateur inscrit avec succès' });
    } catch (error) {
        console.error('Error during registration of accompagnateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


router.post('/login/accompagnateur', async (req, res) => {
    const { mail, mdp } = req.body;

    try {
        // Récupérer l'accompagnateur par son email
        const result = await db.query('SELECT * FROM Accompagnateur WHERE mail = $1', [mail]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Accompagnateur non trouvé' });
        }
        const accompagnateur = result.rows[0];

        const passwordMatch = await bcrypt.compare(mdp, accompagnateur.mdp);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: accompagnateur.idacc, role: 'accompagnateur' }, jwtSecret);
        res.cookie('token', token, { httpOnly: false, sameSite: 'Lax' }).json({ idaccompagnateur : accompagnateur.idacc });
    } catch (error) {
        console.error('Error during login of accompagnateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour récupérer les accompagnateurs
router.get('/accompagnateurs', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Accompagnateur');
        const accompagnateurs = result.rows;
        res.status(200).json({ accompagnateurs });
    } catch (error) {
        console.error('Error fetching accompagnateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour récupérer les interprètes
router.get('/interpretes', authenticateUser, authorizeCommissionScolaire, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Interprete');
        const interpretes = result.rows;
        res.status(200).json({ interpretes });
    } catch (error) {
        console.error('Error fetching interpretes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



// Route pour la déconnexion
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
});


module.exports = router;