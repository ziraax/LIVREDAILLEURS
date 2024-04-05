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



