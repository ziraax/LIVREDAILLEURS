-- CREATION DES TRIGGER POUR GERER LES CONTRAINTES FORTES


-- Un auteur qui participe à l’édition est nécessairement vérifié et veutParticiper : Statique Forte


CREATE OR REPLACE FUNCTION tgParticipationAuteur() RETURNS TRIGGER AS $$
DECLARE
    v_verifie BOOLEAN;
    v_veutParticiper BOOLEAN; 
BEGIN
    -- Récupération des attributs 'verifie' et 'veutParticiper' de l'Auteur concerné
    SELECT verifie, veutParticiper INTO v_verifie, v_veutParticiper FROM Auteur a
        WHERE  NEW.idAuteur = a.idAuteur;
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF v_verifie <> TRUE THEN
        RAISE EXCEPTION 'L''auteur n''est pas encore vérifié';  
    ELSEIF v_veutParticiper <> TRUE THEN
        RAISE EXCEPTION 'L''auteur ne veut pas participer à l''édition';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;


-- Création du Trigger associé à la procédure stockée tgParticipationAuteur (seuleument à l'insertiion)
CREATE OR REPLACE TRIGGER tgParticipationAuteur 
    BEFORE INSERT ON Auteur_Edition
    FOR EACH ROW EXECUTE PROCEDURE tgParticipationAuteur();



-- Un établissement qui participe à l’édition est nécessairement vérifié et veutParticiper : Statique Forte


CREATE OR REPLACE FUNCTION tgParticipationEtab() RETURNS TRIGGER AS $$
DECLARE
    v_verifie BOOLEAN;
    v_veutParticiper BOOLEAN; 
BEGIN
    -- Récupération des attributs 'verifie' et 'veutParticiper' de l'Etablissement concerné
    SELECT verifie, veutParticiper INTO v_verifie, v_veutParticiper FROM Etablissement e
        WHERE  NEW.idAuteur = e.idAuteur;
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF v_verifie <> TRUE THEN
        RAISE EXCEPTION 'L''établissement n''est pas encore vérifié';  
    ELSEIF v_veutParticiper <> TRUE THEN
        RAISE EXCEPTION 'L''établissement ne veut pas participer à l''édition';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tgParticipationEtab (seuleument à l'insertiion)
CREATE OR REPLACE TRIGGER tgParticipationEtab 
    BEFORE INSERT ON Etablissement_Edition
    FOR EACH ROW EXECUTE PROCEDURE tgParticipationEtab();



-- L’état d’un voeu (Voeu.état) ne peut pas passer de “refusé” à “validé” ; ni passer de “refusé” ou “validé” à “déposé” : Dynamique Forte

CREATE OR REPLACE FUNCTION tgMajEtatVoeu() RETURNS TRIGGER AS $$

BEGIN
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF OLD.etat = 'refusé' AND NEW.etat = 'validé' THEN
        RAISE EXCEPTION 'L''état d''un voeu ne peut pas passer de refusé à validé';  
    ELSEIF OLD.etat = 'refusé' AND NEW.etat = 'déposé' THEN
        RAISE EXCEPTION 'L''état d''un voeu ne peut pas passer de refusé à déposé';
    ELSEIF OLD.etat = 'validé' AND NEW.etat = 'déposé' THEN
        RAISE EXCEPTION 'L''état d''un voeu ne peut pas passer de déposé à déposé';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tgMajEtatVoeu
CREATE OR REPLACE TRIGGER tgMajEtatVoeu 
    BEFORE INSERT OR UPDATE ON Voeu
    FOR EACH ROW EXECUTE PROCEDURE tgMajEtatVoeu();




-- L’état d’une intervention (Intervention.étatInterv) ne peut pas passer de “annulée” ou “remplacé” à “planifiée”, ni de “planifiée” à “remplacée” :- Dynamique Forte

CREATE OR REPLACE FUNCTION tgMajEtatInterv() RETURNS TRIGGER AS $$

BEGIN
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF OLD.etat = 'annulée' AND NEW.etat = 'planifiée' THEN
        RAISE EXCEPTION 'L''état d''une intervention ne peut pas passer de annulée à planifiée';  
    ELSEIF OLD.etat = 'remplacée' AND NEW.etat = 'planifiée' THEN
        RAISE EXCEPTION 'L''état d''une intervention ne peut pas passer de remplacée à planifiée';  
    ELSEIF OLD.etat = 'planifiée' AND NEW.etat = 'remplacée' THEN
        RAISE EXCEPTION 'L''état d''une intervention ne peut pas passer de planifiée à remplacée';  
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tgMajEtatInterv
CREATE OR REPLACE TRIGGER tgMajEtatInterv
    BEFORE INSERT OR UPDATE ON Intervention
    FOR EACH ROW EXECUTE PROCEDURE tgMajEtatInterv();




-- Un auteur ne peut pas changer sa volonté de participation (Auteur.veutParticiper) après la fin des inscriptions : Dynamique Forte

CREATE OR REPLACE FUNCTION tgVeutParticiperAuteur() RETURNS TRIGGER AS $$
DECLARE
    v_finInscriptions DATE;
BEGIN
    -- Récupération de la date de fin des inscriptions de l'édition de l'année en cours
    SELECT finInscriptions INTO v_finInscriptions FROM Edition e
        WHERE  e.annee = date_part('year', CURRENT_DATE);
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF v_finInscriptions > CURRENT_DATE AND NEW.veutParticiper <> OLD.veutParticiper THEN
        RAISE EXCEPTION 'La période des iscriptions est déjà passée, l''auteur ne peut pas modifier sa volontée de participation pour l''édition';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tgVeutParticiperAuteur
CREATE OR REPLACE TRIGGER tgVeutParticiperAuteur 
    BEFORE INSERT OR UPDATE ON Auteur
    FOR EACH ROW EXECUTE PROCEDURE tgVeutParticiperAuteur();





-- Un établissement ne peut pas changer sa volonté de participation (Etablissement.veutParticiper) après la fin des inscriptions : Dynamique Forte

CREATE OR REPLACE FUNCTION tgVeutParticiperEtab() RETURNS TRIGGER AS $$
DECLARE
    v_finInscriptions DATE;
BEGIN
    -- Récupération de la date de fin des inscriptions de l'édition de l'année en cours
    SELECT finInscriptions INTO v_finInscriptions FROM Edition e
        WHERE  e.annee = date_part('year', CURRENT_DATE);
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF v_finInscriptions > CURRENT_DATE AND NEW.veutParticiper <> OLD.veutParticiper THEN
        RAISE EXCEPTION 'La période des iscriptions est déjà passée, l''établissement ne peut pas modifier sa volontée de participation pour l''édition';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tgVeutParticiperEtab
CREATE OR REPLACE TRIGGER tgVeutParticiperEtab 
    BEFORE INSERT OR UPDATE ON Etablissement
    FOR EACH ROW EXECUTE PROCEDURE tgVeutParticiperEtab();




-- Les voeux sont obligatoirement soumis entre les dates Edition.debutVoeux et Edition.finVoeux : Statique Forte

CREATE OR REPLACE FUNCTION tgSoumissionVoeu() RETURNS TRIGGER AS $$
DECLARE
    v_finInscriptions DATE;
    v_debutInscriptions DATE;
BEGIN
    -- Récupération des dates des inscriptions de l'édition de l'année en cours
    SELECT finInscriptions, debutInscriptions INTO v_finInscriptions, v_debutInscriptions FROM Edition e
        WHERE  e.annee = date_part('year', CURRENT_DATE);
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF CURRENT_DATE < v_debutInscriptions THEN  
        RAISE EXCEPTION 'La période des inscriptions n''a pas encore lieu';
    ELSEIF CURRENT_DATE > v_finInscriptions THEN  
        RAISE EXCEPTION 'La période des inscriptions est déjà passée';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tgSoumissionVoeu
CREATE OR REPLACE TRIGGER tgSoumissionVoeu 
    BEFORE INSERT OR UPDATE ON Voeu
    FOR EACH ROW EXECUTE PROCEDURE tgSoumissionVoeu();





-- un auteur est limité à 3 interventions par jour : Statique Forte (/!\ remplacements)

CREATE OR REPLACE FUNCTION tg3IntervJour() RETURNS TRIGGER AS $$
DECLARE
    v_nbInterv INTEGER; -- variable qui stock le nombre d'interventions fait par l'auteur de l'intervention le jour de l'intervention
BEGIN
    -- Récupération du nombre d'interventions fait par l'auteur de l'intervention le jour de l'intervention
    SELECT COUNT(*) INTO v_nbInterv FROM Intervention i
        WHERE NEW.idAuteur = i.idAuteur
        AND NEW.idDateInterv = i.idDateInterv;
    -- On lève des exceptions si la contrainte n'est pas respectée
    IF v_nbInterv >= 3 THEN  
        RAISE EXCEPTION 'L''auteur ne peut pas faire plus d''interventions (>3) ce jour';
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Création du Trigger associé à la procédure stockée tg3IntervJour
CREATE OR REPLACE TRIGGER tg3IntervJour 
    BEFORE INSERT OR UPDATE ON Intervention
    FOR EACH ROW EXECUTE PROCEDURE tg3IntervJour();