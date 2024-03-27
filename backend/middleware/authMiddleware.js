require('dotenv').config();


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;


// Middleware d'authentification
const authenticateUser = (req, res, next) => {
    // Récupérer le token JWT depuis le cookie ou les en-têtes de la requête
    let token;
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization) {
        const authorizationHeaderParts = req.headers.authorization.split(' ');
        if (authorizationHeaderParts.length === 2 && authorizationHeaderParts[0] === 'Bearer') {
            token = authorizationHeaderParts[1];
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
        // Vérifier et décoder le token JWT
        const decodedToken = jwt.verify(token, jwtSecret);
        // Attach user info to request object
        req.user = decodedToken;
        console.log(req.user)
        next(); // Passer au middleware suivant
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(401).json({ message: 'Token invalide' });
    }
};


// Middleware d'autorisation par rôle pour les auteurs
const authorizeAuteur = (req, res, next) => {
    if (req.user.role !== 'auteur') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
};

// Middleware d'autorisation par rôle pour les établissements
const authorizeEtablissement = (req, res, next) => {
    if (req.user.role !== 'etablissement') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
};

// Middleware d'autorisation par rôle pour les commissions scolaires
const authorizeCommissionScolaire = (req, res, next) => {
    if (req.user.role !== 'commission-scolaire') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
};

module.exports = { authenticateUser, authorizeAuteur, authorizeEtablissement, authorizeCommissionScolaire };
