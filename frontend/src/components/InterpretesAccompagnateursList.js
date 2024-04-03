import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterpretesAccompagnateursList = () => {
  const [accompagnateurs, setAccompagnateurs] = useState([]);
  const [interpretes, setInterpretes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccompagnateurs = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const response = await axios.get('http://localhost:3000/accompagnateurs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAccompagnateurs(response.data.accompagnateurs);
      } catch (error) {
        setError('Erreur lors du chargement des accompagnateurs');
      }
    };

    const fetchInterpretes = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const response = await axios.get('http://localhost:3000/interpretes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setInterpretes(response.data.interpretes);
      } catch (error) {
        setError('Erreur lors du chargement des interprètes');
      }
    };

    fetchAccompagnateurs();
    fetchInterpretes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Liste du Personnel</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Accompagnateurs</h3>
          <ul>
            {accompagnateurs.map((accompagnateur) => (
              <li key={accompagnateur.idAcc} className="mb-2">
                <span className="font-semibold">{accompagnateur.nom} {accompagnateur.prenom}</span>
                <br />
                <span className="text-gray-600">{accompagnateur.mail} - {accompagnateur.numTel}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Interprètes</h3>
          <ul>
            {interpretes.map((interprete) => (
              <li key={interprete.idInterp} className="mb-2">
                <span className="font-semibold">{interprete.nom} {interprete.prenom}</span>
                <br />
                <span className="text-gray-600">{interprete.mail} - {interprete.numTel}</span>
                <br />
                <span className="text-gray-600">Langue source : {interprete.languesource} - Langue cible : {interprete.languecible}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterpretesAccompagnateursList;
