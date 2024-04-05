-- création des domaines

CREATE DOMAIN EmailAddress VARCHAR(255) 
    CHECK (VALUE ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') NOT NULL;

CREATE DOMAIN MotDePasse VARCHAR(255) CHECK (LENGTH(VALUE) >= 8) NOT NULL;
	