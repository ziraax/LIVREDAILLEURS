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

CREATE OR REPLACE FUNCTION get_ouvrages_by_edition(p_id_edition INTEGER)
RETURNS JSON
AS $$
DECLARE
    ouvrages_json JSON;
BEGIN
    SELECT json_agg(ouvrages)
    INTO ouvrages_json
    FROM (
        SELECT O.idOuvrage, O.titre, O.classesConcernees, O.publicsCibles, O.description, O.langue
        FROM Ouvrage O
        JOIN Ouvrage_Edition OE ON O.idOuvrage = OE.idOuvrage
        WHERE OE.idEdition = p_id_edition
    ) ouvrages;

    RETURN ouvrages_json;
END;
$$ LANGUAGE plpgsql;



