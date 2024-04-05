DROP TABLE IF EXISTS StatsOuvrages;
CREATE TABLE StatsOuvrages( -- générées à la fin des inscriptions
    idStatsO SERIAL,
    annee INTEGER UNIQUE NOT NULL CHECK (annee > 2000 AND annee < 2100),
    nbOuvrages INTEGER NOT NULL CHECK (nbOuvrages >= 0),   -- tous les "nb" sont positifs
    nbAuteurs INTEGER NOT NULL CHECK (nbAuteurs >= 0),
    nbOuvragesEnfant INTEGER NOT NULL CHECK (nbOuvragesEnfant >= 0), 
    nbOuvragesAdulte INTEGER NOT NULL CHECK (nbOuvragesAdulte >= 0),
    PRIMARY KEY (idStatsO)
);

DROP TABLE IF EXISTS StatsCampagneVoeux;
CREATE TABLE StatsCampagneVoeux( -- générées à la fin de la campagne de voeux
    idStatsCV SERIAL,
    annee INTEGER UNIQUE NOT NULL CHECK (annee > 2000 AND annee < 2100),
    nbEtaParticipants INTEGER NOT NULL CHECK (nbEtaParticipants > 0),
    nbEtaVoeuSoumis INTEGER NOT NULL CHECK (nbEtaVoeuSoumis > 0),
    nbVoeux INTEGER NOT NULL CHECK (nbVoeux > 0),
    nbVoeuxMoyen NUMERIC(2,2) GENERATED ALWAYS AS (nbVoeux / nbEtaParticipants) STORED,
    tauxParticipation NUMERIC(2,2) GENERATED ALWAYS AS (nbEtaVoeuSoumis / nbEtaParticipants) STORED, --marche comme DEFAULT mais maj à chaque modif
    PRIMARY KEY (idStatsCV),
    CHECK (nbEtaParticipants >= nbEtaVoeuSoumis),
    CHECK (nbEtaVoeuSoumis >= nbVoeux)
);

DROP TABLE IF EXISTS StatsInterventions;
CREATE TABLE StatsInterventions(
    idStatsI SERIAL,
    annee INTEGER UNIQUE NOT NULL CHECK (annee > 2000 AND annee < 2100),
    nbElevesCumule INTEGER NOT NULL CHECK (nbElevesCumule > 0),
    nbInterventions INTEGER NOT NULL CHECK (nbInterventions > 0),
    nbElevesMoyen NUMERIC(5,2) GENERATED ALWAYS AS (nbElevesCumule / nbInterventions) STORED, --marche comme DEFAULT mais maj à chaque modif
    PRIMARY KEY (idStatsI),
    CHECK (nbInterventions <= nbElevesCumule)
);


-- création des tables "principales"


DROP TABLE IF EXISTS CommissionScolaire;
CREATE TABLE CommissionScolaire(
	idCommission SERIAL PRIMARY KEY,
	identifiant  VARCHAR(30) UNIQUE NOT NULL,
	mdp MotDePasse,
    mail EmailAddress UNIQUE, 
	prenomResp VARCHAR(30) NOT NULL,
	nomResp VARCHAR(30) NOT NULL,
    numTel VARCHAR(12) UNIQUE CHECK (LENGTH(numTel) >= 10),
    adresse VARCHAR(256) NOT NULL
);


DROP TABLE IF EXISTS Edition;
CREATE TABLE Edition(
    idEdition SERIAL,
    editionNum INTEGER CHECK (editionNum > 0), -- à voir si on supprime pas (inutile)
    annee INTEGER NOT NULL UNIQUE CHECK (annee > 2000 AND annee < 2100),
    description TEXT NULL,
    debutInscritpions DATE NOT NULL,
    finInscriptions DATE NOT NULL,
    debutVoeux DATE NOT NULL,
    finVoeux DATE NOT NULL,
    debutFestival DATE NOT NULL,
    finFestival DATE NOT NULL,
    idStatsInterv INTEGER REFERENCES StatsInterventions, -- l'id à le même nom dans les 2 tables donc pas besoin de "REFERENCES StatsInterventions (idStatsInterv)"
    idStatsCampagneVoeux INTEGER REFERENCES StatsCampagneVoeux, -- même chose pour toutes les clés étrangères qui suiveront
    idStatsOuvrages INTEGER REFERENCES StatsOuvrages,
	idCommission INTEGER REFERENCES CommissionScolaire,
    PRIMARY KEY (idEdition),
    CHECK (debutInscritpions < finInscriptions),
    CHECK (finInscriptions < debutVoeux),
    CHECK (debutVoeux < finVoeux),
    CHECK (finVoeux < debutFestival),
    CHECK (debutFestival < finFestival)
);

DROP TABLE IF EXISTS Auteur;
CREATE TABLE Auteur(
    idAuteur SERIAL,
    identifiant VARCHAR(30) UNIQUE NOT NULL,
    mdp MotDePasse, -- je sais pas chiffrer
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    numTel VARCHAR(12) UNIQUE CHECK (LENGTH(numTel) >= 10), -- à voir si not null ; modifier contraintes de domaine
    mail EmailAddress UNIQUE, --ajouter contraintes de domaine
    adresse VARCHAR(256) NOT NULL,
    localisation VARCHAR(30), --ajouter contraintes de domaine (exemple: 34°42'23.0''N 33°12'34.6''E) à voir si généré automatiquement ou null ou supprimer (vu que c'est pas nous qui nous occupons d'attribuer les interventions en fonction de l'adresse)
    langues VARCHAR(30)[] NOT NULL,
    verifie BOOLEAN NOT NULL DEFAULT FALSE, -- on passe par une fonctionnalité pour le passer à 1
    veutParticiper BOOLEAN NOT NULL DEFAULT TRUE, -- 1 par défaut car considéré comme voulant participer à la prochaine édition à l'inscription d'un auteur ; peut passer par une fonctionnalité pour passer à 0 (ou 1 plus tard)
    PRIMARY KEY (idAuteur),
    UNIQUE (nom, prenom) -- le couple nom, prénom doit être unique
);

DROP TABLE IF EXISTS Ouvrage;
CREATE TABLE Ouvrage(
    idOuvrage SERIAL,
    titre VARCHAR(30) UNIQUE NOT NULL, -- j'ai mis titre à la place de nom
    classesConcernees EEtablissement[] NULL,
    publicsCibles EPublic[] NULL,
    description TEXT NULL,
    langue VARCHAR(30) NOT NULL,
    PRIMARY KEY (idOuvrage)
);

DROP TABLE IF EXISTS Etablissement;
CREATE TABLE Etablissement(
    idEtablissement SERIAL,
    identifiant VARCHAR(30) UNIQUE NOT NULL,
    mdp MotDePasse, -- je sais pas comment les cacher/chiffrer
    nom VARCHAR(30) UNIQUE NOT NULL,
    type EEtablissement NOT NULL,
    numTel VARCHAR(12) UNIQUE CHECK (LENGTH(numTel) >= 10), -- à voir si NOT NULL
    mail EmailAddress UNIQUE, 
    adresse VARCHAR(256) NOT NULL,
    localisation VARCHAR(30), --ajouter contraintes de domaine (exemple: 34°42'23.0''N 33°12'34.6''E) à voir si généré automatiquement ou null ou à supprimer
    verifie BOOLEAN NOT NULL DEFAULT FALSE,
    veutParticiper BOOLEAN NOT NULL DEFAULT TRUE, -- vrai par défaut (qd on inscrtit un établissement ili veut forcément participer à la prochaine édition)
    PRIMARY KEY (idEtablissement)
);

DROP TABLE IF EXISTS Referent;
CREATE TABLE Referent(
    idRef SERIAL,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    numTel VARCHAR(12) UNIQUE CHECK (LENGTH(numTel) >= 10), -- à voir si not null ; modifier contraintes de domaine
    mail EmailAddress UNIQUE,
	mdp MotDePasse,
    idEtablissement INTEGER NOT NULL REFERENCES Etablissement,
    PRIMARY KEY (idRef),
    UNIQUE (nom, prenom) -- le couple nom, prénom doit être unique
);

DROP TABLE IF EXISTS Voeu;
CREATE TABLE Voeu(
    idVoeu SERIAL,
    prio INTEGER NOT NULL CHECK (prio >= 1 AND prio <= 3), --contrainte prio entre 1 et 3
    etat EEtatVoeu NOT NULL DEFAULT 'déposé',
    idEtablissement INTEGER NOT NULL REFERENCES Etablissement,
    idOuvrage INTEGER NOT NULL REFERENCES Ouvrage,
    idRef INTEGER NOT NULL REFERENCES Referent,
    idEdition INTEGER NOT NULL REFERENCES Edition,
    idStatsCV INTEGER NULL REFERENCES StatsCampagneVoeux,
    PRIMARY KEY (idVoeu)
);

DROP TABLE IF EXISTS Accompagnateur;
CREATE TABLE Accompagnateur(
    idAcc SERIAL,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    numTel VARCHAR(12) UNIQUE CHECK (LENGTH(numTel) >= 10), -- à voir si not null ; modifier contraintes de domaine
    mail EmailAddress UNIQUE, --ajouter contraintes de domaine
	mdp MotDePasse,
    PRIMARY KEY (idAcc),
    UNIQUE (nom, prenom) -- couple nom, prénom unique
);

DROP TABLE IF EXISTS Interprete;
CREATE TABLE Interprete(
    idInterp SERIAL,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    numTel VARCHAR(12) UNIQUE CHECK (LENGTH(numTel) >= 10), -- donc taille entre 10 et 12 (on peut ajouter +... si taille 12 ET que des chiffres si taille 10)
    mail EmailAddress UNIQUE,
	mdp MotDePasse,
    langueSource VARCHAR(30) NOT NULL,
    langueCible VARCHAR(30) NOT NULL,
    PRIMARY KEY (idInterp),
    UNIQUE (nom, prenom), -- couple nom, prénom unique
    CHECK (langueSource != langueCible) -- la langue source et la langue cible doivent être différents
);

DROP TABLE IF EXISTS Intervention;
CREATE TABLE Intervention(
    idInterv SERIAL,
    etatInterv EEtatInterv NOT NULL DEFAULT 'planifiée',
    dateInterv DATE NOT NULL,
    hDebut TIME(0) NOT NULL, -- (0) = pas de seconde donc hh:mm
    hFin TIME(0) NOT NULL, -- (0) = pas de seconde donc hh:mm
    nbEleves INTEGER CHECK (nbEleves > 0), -- est null tant que l'intervention n'a pas lieu
    idAuteur INTEGER NOT NULL REFERENCES Auteur,
    idInterp INTEGER REFERENCES Interprete, -- peut être null (par défaut en PostgreSQL) si on se fie aux cardinnalités (pas forcément d'interprète à une intervention)
    idAcc INTEGER NOT NULL REFERENCES Accompagnateur,
    idEdition INTEGER NOT NULL REFERENCES Edition,
    idEtablissement INTEGER NOT NULL REFERENCES Etablissement,
    idStatsI INTEGER REFERENCES StatsInterventions, -- est null tant que les stats n'ont pas été générées (donc faut voir comment marche serial pour les clés étrangères @antoine)
    PRIMARY KEY (idInterv),
    CHECK (hFin -  hDebut > INTERVAL '2 hours' AND hFin -  hDebut < INTERVAL '4 hours')
);


-- création des tables "relationnelles"

DROP TABLE IF EXISTS Etablissement_Edition;
CREATE TABLE Etablissement_Edition(
    idEtablissement INTEGER REFERENCES Etablissement,
    idEdition INTEGER REFERENCES Edition,
    PRIMARY KEY (idEtablissement, idEdition)
);

DROP TABLE IF EXISTS Ouvrage_Auteur;
CREATE TABLE Ouvrage_Auteur(
    idOuvrage INTEGER REFERENCES Ouvrage,
    idAuteur INTEGER REFERENCES Auteur,
    PRIMARY KEY (idOuvrage, idAuteur)
);

DROP TABLE IF EXISTS Ouvrage_Edition;
CREATE TABLE Ouvrage_Edition(
    idOuvrage INTEGER REFERENCES Ouvrage,
    idEdition INTEGER REFERENCES Edition,
    PRIMARY KEY (idOuvrage, idEdition)
);

DROP TABLE IF EXISTS Auteur_Edition;
CREATE TABLE Auteur_Edition(
    idAuteur INTEGER REFERENCES Auteur,
    idEdition INTEGER REFERENCES Edition,
    PRIMARY KEY (idAuteur, idEdition)
);

DROP TABLE IF EXISTS StatsCampagneVoeux_Etablissement;
CREATE TABLE StatsCampagneVoeux_Etablissement(
    idStatsCV INTEGER REFERENCES StatsCampagneVoeux,
    idEtablissement INTEGER REFERENCES Etablissement,
    PRIMARY KEY (idStatsCV, idEtablissement)
);

DROP TABLE IF EXISTS StatsOuvrages_Ouvrage;
CREATE TABLE StatsOuvrages_Ouvrage(
    idStatsO INTEGER REFERENCES StatsOuvrages,
    idOuvrage INTEGER REFERENCES Ouvrage,
    PRIMARY KEY (idStatsO, idOuvrage)
);