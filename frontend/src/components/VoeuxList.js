import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const VoeuxList = () => {
  const [voeux, setVoeux] = useState([]);
  const [showEditionInfo, setShowEditionInfo] = useState(false);
  const [showDeposes, setShowDeposes] = useState(true);
  const [showValides, setShowValides] = useState(true);
  const [showRefuses, setShowRefuses] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoeux = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const response = await axios.get('http://localhost:3000/voeux', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setVoeux(response.data.voeux);
      } catch (error) {
        setError('Erreur lors du chargement des voeux');
      }
    };

    fetchVoeux();
  }, []);

  const handleToggleEditionInfo = () => {
    setShowEditionInfo(!showEditionInfo);
  };

  const handleToggleDeposes = () => {
    setShowDeposes(!showDeposes);
  };

  const handleToggleValides = () => {
    setShowValides(!showValides);
  };

  const handleToggleRefuses = () => {
    setShowRefuses(!showRefuses);
  };

  // Filtrage des voeux en fonction de leur état et de la checkbox correspondante
  const voeuxDeposes = voeux.filter(voeu => voeu.etat === 'déposé');
  const voeuxValides = voeux.filter(voeu => voeu.etat === 'validé');
  const voeuxRefuses = voeux.filter(voeu => voeu.etat === 'refusé');

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Liste des Voeux</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-indigo-600"
            checked={showDeposes}
            onChange={handleToggleDeposes}
          />
          <span className="ml-2 text-gray-700">Voeux Déposés</span>
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-indigo-600"
            checked={showValides}
            onChange={handleToggleValides}
          />
          <span className="ml-2 text-gray-700">Voeux Validés</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-indigo-600"
            checked={showRefuses}
            onChange={handleToggleRefuses}
          />
          <span className="ml-2 text-gray-700">Voeux Refusés</span>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {showDeposes && voeuxDeposes.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Voeux Déposés</h3>
            {voeuxDeposes.map((voeu) => (
              <div key={voeu.idvoeu} className="border border-gray-300 rounded-lg p-4 mb-4">
                <p className="font-bold">Voeu #{voeu.idvoeu}</p>
                <p>État : {voeu.etat}</p>
                <p>Priorité : {voeu.prio}</p>
                <p>Id établissement : {voeu.idetablissement}</p>
                <p>Nom établissement : {voeu.nom}</p>
                <p>Id ouvrage : {voeu.idouvrage}</p>
                <p>Titre ouvrage : {voeu.nom}</p>
                <p>Id auteur : {voeu.idauteur}</p>
                <p>Prenom auteur : {voeu.prenomauteur}</p>
                <p>Nom auteur : {voeu.nomauteur}</p>
                <p>Référent : {voeu.nomref} {voeu.prenomref}</p>
                <p>Email du référent : {voeu.mailref}</p>
                <p>Téléphone du référent : {voeu.numtelref}</p>
                {showEditionInfo && (
                  <>
                    <p>Description de l'édition : {voeu.descriptionedition}</p>
                    <p>Début des inscriptions : {format(new Date(voeu.debutinscriptions), 'dd/MM/yyyy')}</p>
                    <p>Fin des inscriptions : {format(new Date(voeu.fininscriptions), 'dd/MM/yyyy')}</p>
                    <p>Début des voeux : {format(new Date(voeu.debutvoeux), 'dd/MM/yyyy')}</p>
                    <p>Fin des voeux : {format(new Date(voeu.finvoeux), 'dd/MM/yyyy')}</p>
                    <p>Début du festival : {format(new Date(voeu.debutfestival), 'dd/MM/yyyy')}</p>
                    <p>Fin du festival : {format(new Date(voeu.finfestival), 'dd/MM/yyyy')}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {showValides && voeuxValides.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Voeux Validés</h3>
            {voeuxValides.map((voeu) => (
              <div key={voeu.idvoeu} className="border border-gray-300 rounded-lg p-4 mb-4">
                <p className="font-bold">Voeu #{voeu.idvoeu}</p>
                <p>État : {voeu.etat}</p>
                <p>Priorité : {voeu.prio}</p>
                <p>Id établissement : {voeu.idetablissement}</p>
                <p>Nom établissement : {voeu.nom}</p>
                <p>Id ouvrage : {voeu.idouvrage}</p>
                <p>Titre ouvrage : {voeu.nom}</p>
                <p>Id auteur : {voeu.idauteur}</p>
                <p>Prenom auteur : {voeu.prenomauteur}</p>
                <p>Nom auteur : {voeu.nomauteur}</p>
                <p>Référent : {voeu.nomref} {voeu.prenomref}</p>
                <p>Email du référent : {voeu.mailref}</p>
                <p>Téléphone du référent : {voeu.numtelref}</p>
                {showEditionInfo && (
                  <>
                    <p>Description de l'édition : {voeu.descriptionedition}</p>
                    <p>Début des inscriptions : {format(new Date(voeu.debutinscriptions), 'dd/MM/yyyy')}</p>
                    <p>Fin des inscriptions : {format(new Date(voeu.fininscriptions), 'dd/MM/yyyy')}</p>
                    <p>Début des voeux : {format(new Date(voeu.debutvoeux), 'dd/MM/yyyy')}</p>
                    <p>Fin des voeux : {format(new Date(voeu.finvoeux), 'dd/MM/yyyy')}</p>
                    <p>Début du festival : {format(new Date(voeu.debutfestival), 'dd/MM/yyyy')}</p>
                    <p>Fin du festival : {format(new Date(voeu.finfestival), 'dd/MM/yyyy')}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {showRefuses && voeuxRefuses.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Voeux Refusés</h3>
            {voeuxRefuses.map((voeu) => (
              <div key={voeu.idvoeu} className="border border-gray-300 rounded-lg p-4 mb-4">
                <p className="font-bold">Voeu #{voeu.idvoeu}</p>
                <p>État : {voeu.etat}</p>
                <p>Priorité : {voeu.prio}</p>
                <p>Id établissement : {voeu.idetablissement}</p>
                <p>Nom établissement : {voeu.nom}</p>
                <p>Id ouvrage : {voeu.idouvrage}</p>
                <p>Titre ouvrage : {voeu.nom}</p>
                <p>Id auteur : {voeu.idauteur}</p>
                <p>Prenom auteur : {voeu.prenomauteur}</p>
                <p>Nom auteur : {voeu.nomauteur}</p>
                <p>Référent : {voeu.nomref} {voeu.prenomref}</p>
                <p>Email du référent : {voeu.mailref}</p>
                <p>Téléphone du référent : {voeu.numtelref}</p>
                {showEditionInfo && (
                  <>
                    <p>Description de l'édition : {voeu.descriptionedition}</p>
                    <p>Début des inscriptions : {format(new Date(voeu.debutinscriptions), 'dd/MM/yyyy')}</p>
                    <p>Fin des inscriptions : {format(new Date(voeu.fininscriptions), 'dd/MM/yyyy')}</p>
                    <p>Début des voeux : {format(new Date(voeu.debutvoeux), 'dd/MM/yyyy')}</p>
                    <p>Fin des voeux : {format(new Date(voeu.finvoeux), 'dd/MM/yyyy')}</p>
                    <p>Début du festival : {format(new Date(voeu.debutfestival), 'dd/MM/yyyy')}</p>
                    <p>Fin du festival : {format(new Date(voeu.finfestival), 'dd/MM/yyyy')}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoeuxList;
