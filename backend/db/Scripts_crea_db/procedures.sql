CREATE OR REPLACE PROCEDURE sp_insert_auteur(
    p_identifiant VARCHAR(30),
    p_mdp VARCHAR(255),
    p_nom VARCHAR(30),
    p_prenom VARCHAR(30),
    p_num_tel VARCHAR(12),
    p_mail VARCHAR(255),
    p_adresse VARCHAR(256),
	p_localisation VARCHAR(30),
    p_langues VARCHAR(30)[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Auteur (identifiant, mdp, nom, prenom, numTel, mail, adresse, localisation, langues)
    VALUES (p_identifiant, p_mdp, p_nom, p_prenom, p_num_tel, p_mail, p_adresse, p_localisation, p_langues);
END;
$$;

CREATE OR REPLACE PROCEDURE sp_insert_etablissement(
    p_identifiant VARCHAR(30),
    p_mdp VARCHAR(255),
    p_nom VARCHAR(30),
    p_type EEtablissement,
    p_num_tel VARCHAR(12),
    p_mail VARCHAR(255),
    p_adresse VARCHAR(256),
    p_localisation VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Etablissement (identifiant, mdp, nom, type, numTel, mail, adresse, localisation)
    VALUES (p_identifiant, p_mdp, p_nom, p_type, p_num_tel, p_mail, p_adresse, p_localisation);
END;
$$;

CREATE OR REPLACE PROCEDURE sp_insert_commission_scolaire(
    p_identifiant VARCHAR(30),
    p_mdp VARCHAR(255),
    p_mail VARCHAR(255),
    p_prenom_resp VARCHAR(30),
    p_nom_resp VARCHAR(30),
	p_num_tel VARCHAR(12),
	p_adresse VARCHAR(256)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO CommissionScolaire (identifiant, mdp, mail, prenomResp, nomResp, numTel, adresse)
    VALUES (p_identifiant, p_mdp, p_mail, p_prenom_resp, p_nom_resp, p_num_tel, p_adresse);
END;
$$;

CREATE OR REPLACE PROCEDURE sp_insert_edition(
    p_annee INTEGER,
    p_description TEXT,
    p_debut_inscriptions DATE,
    p_fin_inscriptions DATE,
    p_debut_voeux DATE,
    p_fin_voeux DATE,
    p_debut_festival DATE,
    p_fin_festival DATE,
    p_id_commission INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Edition (annee, description, debutInscriptions, finInscriptions, debutVoeux, finVoeux, debutFestival, finFestival, idCommission)
    VALUES (p_annee, p_description, p_debut_inscriptions, p_fin_inscriptions, p_debut_voeux, p_fin_voeux, p_debut_festival, p_fin_festival, p_id_commission);
END;
$$;

CREATE OR REPLACE PROCEDURE sp_proposer_ouvrage(
    IN p_titre VARCHAR(30),
    IN p_classes_concernees EEtablissement[],
    IN p_publics_cibles EPublic[],
    IN p_description TEXT,
    IN p_langue VARCHAR(30),
    IN p_id_edition INTEGER,
    IN p_id_auteur INTEGER,
    OUT p_success BOOLEAN,
    OUT p_message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    idOuvrage INTEGER; -- Déclaration de la variable idOuvrage
BEGIN
    -- Insertion de l'ouvrage
    INSERT INTO Ouvrage (titre, classesConcernees, publicsCibles, description, langue)
    VALUES (p_titre, p_classes_concernees, p_publics_cibles, p_description, p_langue)
    RETURNING Ouvrage.idOuvrage INTO idOuvrage;

    -- Relier l'ouvrage à l'édition dans la table Ouvrage_Edition
    INSERT INTO Ouvrage_Edition (idOuvrage, idEdition)
    VALUES (idOuvrage, p_id_edition);

    -- Relier l'auteur à l'ouvrage dans la table Ouvrage_Auteur
    INSERT INTO Ouvrage_Auteur (idOuvrage, idAuteur)
    VALUES (idOuvrage, p_id_auteur);

    -- Tout s'est bien passé, on renvoie un succès
    p_success := TRUE;
    p_message := 'Ouvrage proposé avec succès';

EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, on renvoie un échec avec le message d'erreur
        p_success := FALSE;
        p_message := SQLERRM;
END;
$$;




-- CREATION DES PROCEDURES DE GENERATION ET D'AFFICHAGE DES STATS


-- Génération des statistiques sur les ouvrages

CREATE OR REPLACE PROCEDURE generateStatsOuvrages(p_idEdition INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
	v_annee INTEGER;
	v_nbOuvrages INTEGER;
    v_nbAuteurs INTEGER;
    v_nbOuvragesEnfant INTEGER;
    v_nbOuvragesAdulte INTEGER;
    v_idOuvrage INTEGER;
	v_idStatsO INTEGER;
BEGIN
	-- génération des statistiques
	SELECT annee INTO v_annee FROM Edition e 
		WHERE p_idEdition = e.idEdition;
	SELECT COUNT(*) INTO v_nbOuvrages FROM Ouvrage_Edition oe
		WHERE oe.idEdition = p_idEdition;
	SELECT COUNT(*) INTO v_nbAuteurs FROM Auteur_Edition ae
		WHERE ae.idEdition = p_idEdition;
	SELECT COUNT(*) INTO v_nbOuvragesEnfant FROM Ouvrage_Edition oe, Ouvrage o 
		WHERE oe.idEdition = p_idEdition
		AND oe.idOuvrage = o.idOuvrage
		AND 'jeune enfant' = ANY (o.publicsCibles)
			OR 'enfant' = ANY (o.publicsCibles)
			OR 'ado' = ANY (o.publicsCibles);
	SELECT COUNT(*) INTO v_nbOuvragesEnfant FROM Ouvrage_Edition oe, Ouvrage o 
		WHERE oe.idEdition = p_idEdition
		AND oe.idOuvrage = o.idOuvrage
		AND 'jeune adulte' = ANY (o.publicsCibles)
			OR 'adulte' = ANY (o.publicsCibles);
	
	-- insertion des statistiques
	INSERT INTO StatsOuvrages(annee, nbOuvrages, nbAuteurs, nbOuvragesEnfant, nbOuvragesAdulte)
		VALUES(v_annee, v_nbOuvrages, v_nbAuteurs, v_nbOuvragesEnfant, v_nbOuvragesAdulte);


	SELECT idStatsO INTO v_idStatsO FROM StatsOuvrages -- récupération de l'id de la nouvelle ligne
		WHERE annee = p_annee;
	
	UPDATE Edition -- ajout dans la ligne correspondante d'Edition la nouvelle FK
		SET idStatsO = v_idStatsO
		WHERE idEdition = p_idEdition;
	
	
	SELECT idOuvrage INTO v_idOuvrage FROM Ouvrage_Edition -- récupération des id des Ouvrages selectionnés pour l'édition
		WHERE idEdition = p_idEdition;

	UPDATE StatsOuvrages_Ouvrage -- ajout de la nouvelle FK dans les lignes correspondantes d'Etablissement
		SET idStatsO = v_idStatsO
		WHERE idOuvrage = v_idOuvrage;

END;
$$;


-- Retourne les statistiques sur les ouvrages et fait appel à la procédure de génération si elles n'ont pas encore été générée

CREATE OR REPLACE FUNCTION getStatsOuvrages(p_annee INTEGER) 
	RETURNS TEXT
AS $$
DECLARE
	v_idEdition INTEGER;
	v_finInscriptions DATE;
	v_idStatsO INTEGER;
	rec_statsOuvrages RECORD;
BEGIN
	-- Récupération de l'édition dont l'année est passée en paramètre
	SELECT idEdition INTO v_idEdition FROM Edition e
		WHERE p_annee =  e.annee;

	-- Levée d'exception si l'année entrée en paramètre ne corresppond à aucune édition	
	IF v_idEdition IS NULL THEN
		RAISE EXCEPTION 'L''année passée en paramètre est incorrecte';
	END IF;

	-- Récupération des stats de l'édition
	SELECT idStatsO INTO v_idStatsO FROM StatsOuvrages s
		WHERE p_annee =  s.annee;

	-- Génération des statistiques si elles n'existent pas encore
	IF v_idStatsO IS NULL THEN

		-- Récupération de la date de fin des inscriptions
		SELECT finInscriptions INTO v_finInscriptions FROM Edition e
			WHERE v_idEdition = e.idEdition;

		-- si la date n'est pas encore passée, on lève une exception
		IF v_finInscriptions > CURRENT_DATE  THEN
			RAISE EXCEPTION 'Les statistiques ne peuvent pas encore être generées';

		-- sinon on génère les statistiques
		ELSE
			CALL generateStatsOuvrages(p_annee);
		END IF;
	END IF;

	-- on retourne un text contenant les différentes statistiques
	SELECT annee, nbOuvrages, nbAuteurs, nbOuvragesEnfant, nbOuvragesAdulte INTO rec_statsOuvrages FROM StatsOuvrages s
	WHERE v_idStatsO = s.idStatsO;
	RETURN rec_statsOuvrages;	
END;
$$ LANGUAGE plpgsql;






-- Génération des statistiques sur la campagne de voeux

CREATE OR REPLACE PROCEDURE generateStatsVoeux(p_idEdition INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
	v_annee INTEGER;
	v_nbEtaParticipants INTEGER;
    v_nbEtaVoeuSoumis INTEGER;
    v_nbVoeux INTEGER;
    v_idStatsCV INTEGER;
    v_idEtablissement INTEGER;
BEGIN
	-- génération des statistiques
	SELECT annee INTO v_annee FROM Edition e 
		WHERE p_idEdition = e.idEdition;
	SELECT COUNT(*) INTO v_nbEtaParticipants FROM Etablissement_Edition ee
		WHERE ee.idEdition = p_idEdition;
	SELECT COUNT(*) INTO v_nbEtaVoeuSoumis FROM Etablissement_Edition ee, Etablissement e, Voeu v
		WHERE ee.idEdition = p_idEdition
		AND ee.idEtablissement = v.idEtablissement
		GROUP BY e.idEtablissement;
	SELECT COUNT(*) INTO v_nbVoeux FROM Voeu v
		WHERE v.idEdition = p_idEdition;
	
	-- insertion des statistiques
	INSERT INTO StatsCampagneVoeux(annee, nbEtaParticipants, nbEtaVoeuSoumis, nbVoeux)
		VALUES(v_annee, v_nbEtaParticipants, v_nbEtaVoeuSoumis, v_nbVoeux);


	SELECT idStatsCV INTO v_idStatsCV FROM StatsCampagneVoeux -- récupération de l'id de la nouvelle ligne
		WHERE annee = p_annee;
	
	UPDATE Edition -- ajout dans la ligne correspondante d'Edition la nouvelle FK
		SET idStatsCV = v_idStatsCV
		WHERE idEdition = p_idEdition;
	

	SELECT idEtablissement INTO v_idEtablissement FROM Etablissement_Edition -- récupération des id des Etablissement participant à l'édition
		WHERE idEdition = p_idEdition;

	UPDATE StatsCampagneVoeux_Etablissement -- ajout de la nouvelle FK dans les lignes correspondantes d'Etablissement
		SET idStatsCV = v_idStatsCV
		WHERE idEtablissement = v_idEtablissement;


	UPDATE Voeu -- ajout de la nouvelle FK dans les ligne correspondantes de Voeu
		SET idStatsCV = v_idStatsCV
		WHERE idEdition = p_idEdition;

END;
$$;


-- Retourne les statistiques sur la campagne de voeux et fait appel à la procédure de génération si elles n'ont pas encore été générée

CREATE OR REPLACE FUNCTION getStatsVoeux(p_annee INTEGER) 
	RETURNS TEXT
AS $$
DECLARE
	v_idEdition INTEGER;
	v_finVoeux DATE;
	v_idStatsCV INTEGER;
	rec_statsVoeux RECORD;
BEGIN
	-- Récupération de l'édition dont l'année est passée en paramètre
	SELECT idEdition INTO v_idEdition FROM Edition e
		WHERE p_annee =  e.annee;

	-- Levée d'exception si l'année entrée en paramètre ne corresppond à aucune édition	
	IF v_idEdition IS NULL THEN
		RAISE EXCEPTION 'L''année passée en paramètre est incorrecte';
	END IF;

	-- Récupération des stats de l'édition
	SELECT idStatsCV INTO v_idStatsCV FROM StatsCampagneVoeux s
		WHERE p_annee =  s.annee;

	-- Génération des statistiques si elles n'existent pas encore
	IF v_idStatsCV IS NULL THEN

		-- Récupération de la date de fin des inscriptions
		SELECT finVoeux INTO v_finVoeux FROM Edition e
			WHERE v_idEdition = e.idEdition;

		-- si la date n'est pas encore passée, on lève une exception
		IF v_finVoeux > CURRENT_DATE  THEN
			RAISE EXCEPTION 'Les statistiques ne peuvent pas encore être generées';

		-- sinon on génère les statistiques
		ELSE
			CALL generateStatsVoeux(p_annee);
		END IF;
	END IF;

	-- on retourne un text contenant les différentes statistiques
	SELECT annee, nbEtaParticipants, nbEtaVoeuSoumis, nbVoeux, nbVoeuxMoyen, tauxParticipation INTO rec_statsVoeux FROM StatsCampagneVoeux s
	WHERE v_idStatsCV = s.idStatsCV;
	RETURN rec_statsVoeux;	
END;
$$ LANGUAGE plpgsql;





-- Génération des statistiques sur les interventions

CREATE OR REPLACE PROCEDURE generateStatsInterv(p_idEdition INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
	v_annee INTEGER;
	v_nbElevesCumule INTEGER;
    v_nbInterventions INTEGER;
    v_idStatsI INTEGER;
BEGIN
	-- génération des statistiques
	SELECT annee INTO v_annee FROM Edition e 
		WHERE p_idEdition = e.idEdition;
	SELECT SUM(i.nbEleves) INTO v_nbElevesCumule FROM Intervention i
		WHERE i.idEdition = p_idEdition;
	SELECT COUNT(*) INTO v_nbElevesCumule FROM Intervention i
		WHERE i.idEdition = p_idEdition;
	
	-- insertion des statistiques
	INSERT INTO StatsInterventions(annee, nbElevesCumule, nbInterventions) -- nouvelle ligne dans la table statsInterv
		VALUES(v_annee, v_nbElevesCumule, v_nbInterventions);


	SELECT idStatsI INTO v_idStatsI FROM StatsInterventions -- récupération de l'id de la nouvelle ligne
		WHERE annee = p_annee;
	
	UPDATE Edition -- ajout dans la ligne correspondante d'Edition la nouvelle FK
		SET idStatsI = v_idStatsI
		WHERE idEdition = p_idEdition;
	
	UPDATE Intervention -- ajout dans la ligne correspondante d'Intervention la nouvelle FK
		SET idStatsI = v_idStatsI
		WHERE idEdition = p_idEdition;
END;
$$;


-- Retourne les statistiques sur les interventions et fait appel à la procédure de génération si elles n'ont pas encore été générée

CREATE OR REPLACE FUNCTION getStatsInterv(p_annee INTEGER) 
	RETURNS TEXT
AS $$
DECLARE
	v_idEdition INTEGER;
	v_finFestival DATE;
	v_idStatsI INTEGER;
	rec_statsInterv RECORD;
BEGIN
	-- Récupération de l'édition dont l'année est passée en paramètre
	SELECT idEdition INTO v_idEdition FROM Edition e
		WHERE p_annee =  e.annee;

	-- Levée d'exception si l'année entrée en paramètre ne corresppond à aucune édition	
	IF v_idEdition IS NULL THEN
		RAISE EXCEPTION 'L''année passée en paramètre est incorrecte';
	END IF;

	-- Récupération des stats de l'édition
	SELECT idStatsI INTO v_idStatsI FROM StatsInterventions s
		WHERE p_annee =  s.annee;

	-- Génération des statistiques si elles n'existent pas encore
	IF v_idStatsI IS NULL THEN

		-- Récupération de la date de fin des inscriptions
		SELECT finFestival INTO v_finFestival FROM Edition e
			WHERE v_idEdition = e.idEdition;

		-- si la date n'est pas encore passée, on lève une exception
		IF v_finFestival > CURRENT_DATE  THEN
			RAISE EXCEPTION 'Les statistiques ne peuvent pas encore être generées';

		-- sinon on génère les statistiques
		ELSE
			CALL generateStatsInterv(p_annee);
		END IF;
	END IF;

	-- on retourne un text contenant les différentes statistiques
	SELECT annee, nbElevesCumule, nbInterventions, nbElevesMoyen INTO rec_statsInterv FROM StatsInterventions s
	WHERE v_idStatsI = s.idStatsI;
	RETURN rec_statsInterv;	
END;
$$ LANGUAGE plpgsql;







