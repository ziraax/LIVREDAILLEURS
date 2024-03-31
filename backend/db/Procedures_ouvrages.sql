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



