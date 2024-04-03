import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OuvragesAuteur = ({ idAuteur }) => {
  const [ouvrages, setOuvrages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOuvrages = async () => {
      try {
        // Récupérer le token depuis les cookies
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        const response = await axios.get(`http://localhost:3000/auteur/${idAuteur}/ouvrages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOuvrages(response.data);
      } catch (error) {
        console.error('Error fetching ouvrages for author:', error);
        setError('Erreur lors de la récupération des ouvrages');
      }
    };

    fetchOuvrages();
  }, [idAuteur]);

  return (
    <div className="bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-xl font-bold mb-4">Ouvrages de l'auteur</h2>
      <ul>
        {ouvrages.map((ouvrage) => (
          <li key={ouvrage.idouvrage} className="mb-4">
            <h3 className="text-lg font-semibold">{ouvrage.titre}</h3>
            <p className="text-sm text-gray-600 mb-2">Langue: {ouvrage.langue}</p>
            <p className="text-sm text-gray-600 mb-2">Description: {ouvrage.description}</p>
            <p className="text-sm text-gray-600 mb-2">Année de l'édition: {ouvrage.annee}</p>
            <p className="text-sm text-gray-600 mb-2">Classes concernées: {ouvrage.classesconcernees}</p>
            <p className="text-sm text-gray-600 mb-2">Publics cibles: {ouvrage.publicscibles}</p>
          </li>
        ))}
      </ul>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OuvragesAuteur;
