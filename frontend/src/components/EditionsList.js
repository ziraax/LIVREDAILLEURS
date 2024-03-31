import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const EditionList = () => {
  const [editions, setEditions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/edition');
        setEditions(response.data);
      } catch (error) {
        setError('Error fetching editions');
      }
    };

    fetchEditions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Editions</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {editions.map((edition) => (
          <li key={edition.idedition} className="border border-gray-300 rounded-lg p-4 mb-4">
            <p className="font-bold text-xl">Description : {edition.description}</p>
            <p>Year: {edition.annee}</p>
            <p>Début des inscriptions : {format(new Date(edition.debutinscriptions), 'dd/MM/yyyy')}</p>
            <p>Fin des inscriptions : {format(new Date(edition.fininscriptions), 'dd/MM/yyyy')}</p>
            <p>Début voeux : {format(new Date(edition.debutvoeux), 'dd/MM/yyyy')}</p>
            <p>Fin des voeux : {format(new Date(edition.finvoeux), 'dd/MM/yyyy')}</p>
            <p>Début du festival : {format(new Date(edition.debutfestival), 'dd/MM/yyyy')}</p>
            <p>Fin du festival : {format(new Date(edition.finfestival), 'dd/MM/yyyy')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditionList;
