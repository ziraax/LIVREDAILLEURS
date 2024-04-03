import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const InterventionsList = ({ idEtablissement }) => {
  const [interventions, setInterventions] = useState([]);
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/edition');
        setEditions(response.data);
      } catch (error) {
        console.error('Error fetching editions:', error);
      }
    };

    fetchEditions();
  }, []);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        if (editions.length > 0) {
          const interventionsPromises = editions.map(async (edition) => {
            try {
              const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
              const response = await axios.get(`http://localhost:3000/edition/${edition.idedition}/etablissements/${idEtablissement}/interventions`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              return response.data.interventions;
            } catch (error) {
              console.error(`Error fetching interventions for edition ${edition.id}:`, error);
              return [];
            }
          });

          const allInterventions = await Promise.all(interventionsPromises);
          const flattenedInterventions = allInterventions.flat();
          setInterventions(flattenedInterventions);
        }
      } catch (error) {
        console.error('Error fetching interventions:', error);
      }
    };

    fetchInterventions();
  }, [idEtablissement, editions]);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Liste des Interventions</h3>
      <ul>
        {interventions.map((intervention) => (
          <li key={intervention.idinterv} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-bold leading-6 text-gray-900">{format(new Date(intervention.dateinterv), 'dd/MM/yyyy')}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{intervention.etatinterv}</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Heure de début</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.hdebut}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Heure de fin</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.hfin}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Nombre d'élèves</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.nbeleves}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Auteur</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.nomauteur} {intervention.prenomauteur}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Interprète</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.nominterprete} {intervention.prenominterprete}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Accompagnateur</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.nomaccompagnateur} {intervention.prenomaccompagnateur}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Année de l'édition</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.anneeedition}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Description de l'édition</dt>
                  <dd className="mt-1 text-sm text-gray-900">{intervention.descedition}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterventionsList;
