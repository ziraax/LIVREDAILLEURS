-- création des énumérations

DROP TYPE IF EXISTS EEtablissement;
CREATE TYPE EEtablissement AS ENUM ('université', 'lycée général', 'lycée professionnel', 'collège', 'école primaire', 'école maternelle', 'médico-sociaux', 'pénitentiaire');

DROP TYPE IF EXISTS EPublic;
CREATE TYPE EPublic AS ENUM ('jeune enfant', 'enfant', 'ado', 'jeune adulte', 'adulte');

DROP TYPE IF EXISTS EEtatVoeu;
CREATE TYPE EEtatVoeu AS ENUM ('déposé', 'validé', 'refusé');

DROP TYPE IF EXISTS EEtatInterv;
CREATE TYPE EEtatInterv AS ENUM ('planifiée', 'annulée', 'remplacée');