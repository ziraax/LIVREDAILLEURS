# LIVREDAILLEURS

## Description

Livres D'ailleurs est une application web permettant l'organisation et la gestion du festival littéraire international du même nom. Cette application facilite la planification des interventions des auteurs participants dans différents établissements pour chaque édition du festival.

## Installation

Assurez-vous d'avoir PostgreSQL installé sur votre machine. Si ce n'est pas le cas, téléchargez et installez-le depuis le site officiel : [PostgreSQL Downloads](https://www.postgresql.org/download/).

 Assurez-vous d'avoir Node.js installé sur votre machine. Si ce n'est pas le cas, téléchargez et installez-le depuis le site officiel : [Node.js Downloads](https://nodejs.org/).

1. Clonez ce dépôt sur votre machine locale :
    ```bash
    git clone https://github.com/ziraax/LIVREDAILLEURS.git
    ```

2. Accédez au répertoire du projet : 
    ```bash
    cd LIVREDAILLEURS
    ```

Ce projet se décompose en deux parties : frontend et backend

1. Installation du backend : 

    ```bash
    cd backend
    npm install
    ```

2. Créez une base de données PostgreSQL et configurez les informations de connexion dans un fichier `.env`. Vous pouvez trouver un exemple de fichier `.env.example` à utiliser comme modèle. Le site à été créer avec PgAdmin. 

3. Les fichiers sql contenants les requetes de création des tables et procédures etc se trouvent dans le dossier : 

    ```bash
    LIVRE_AILLEURS\backend\db>
    ```
    Il est necessaire de créer les domaines et les types en premier, ensuite les tables puis les procedures et les fonctions.

4. Lancez la base de données PostgreSQL si ce n'est pas déjà fait à l'aide de pgAdmin ou de la ligne de commande :
    ```bash
    pg_ctl -D /path/to/your/database start
    ```

5. Finally run in the backend folder : 
    ```bash 
    node index.js
    ```

Le serveur devrait se lancer correctement sur le port 3000.

## Installation du Frontend
   
1. Accédez au répertoire du frontend :
    ```bash
    cd frontend
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Lancez l'application :
    ```bash
    npm start
    ```

6. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:3001`.

L'application devrait se lancer sur le port 3001 (car 3000 déjà occupé par le backend).

## Fonctionnalités
- Gestion des auteurs et des établissements participants.
- Planification des interventions des auteurs pour chaque édition du festival.
- Interface web pour l'inscription et l'authentification des utilisateurs.
- Campagne de vœux pour les établissements participants.
- Et pleins d'autres choses :smiley:

## Technologies utilisées
- Frontend : React.js
- Backend : Node.js, Express.js
- Base de données : PostgreSQL
- Authentification : JSON Web Tokens (JWT)

## Home page 

![home page](./frontend/public/showcase/image.png)
Et d'autres pages à découvrir ! 

## Licence
Ce projet est sous licence [MIT](https://choosealicense.com/licenses/mit/).