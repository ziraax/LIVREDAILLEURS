// ReferentsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReferentsList = ({ idEtablissement }) => {
  const [referents, setReferents] = useState([]);

  useEffect(() => {
    const fetchReferents = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const response = await axios.get(`http://localhost:3000/referents/${idEtablissement}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReferents(response.data.referents);
      } catch (error) {
        console.error('Error fetching referents:', error);
      }
    };

    fetchReferents();
  }, [idEtablissement]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Liste des référents</h2>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {referents.map(referent => (
            <div key={referent.idRef} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nom</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{referent.nom}</dd>
              <dt className="text-sm font-medium text-gray-500">Prénom</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{referent.prenom}</dd>
              <dt className="text-sm font-medium text-gray-500">Mail</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{referent.mail}</dd>
              <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{referent.numtel}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ReferentsList;
