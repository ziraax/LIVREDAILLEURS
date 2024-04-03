import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterventionForm = () => {
  const [editions, setEditions] = useState([]);
  const [selectedEditionId, setSelectedEditionId] = useState('');
  const [etatInterv, setEtatInterv] = useState('');
  const [dateInterv, setDateInterv] = useState('');
  const [hDebut, setHDebut] = useState('');
  const [hFin, setHFin] = useState('');
  const [nbEleves, setNbEleves] = useState('');
  const [idAuteur, setIdAuteur] = useState('');
  const [idInterp, setIdInterp] = useState('');
  const [idAcc, setIdAcc] = useState('');
  const [idEtablissement, setIdEtablissement] = useState('');
  const [idVoeu, setIdVoeu] = useState('');
  const [voeux, setVoeux] = useState([]);

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
    const fetchVoeux = async () => {
        try {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            const response = await axios.get('http://localhost:3000/voeux', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            setVoeux(response.data.voeux);
            console.log(response.data.voeux);
        } catch (error) {
            console.error('Error fetching voeux:', error);
        }
    };

    fetchVoeux();
  }, []);

  const handleEditionChange = (event) => {
    setSelectedEditionId(event.target.value);
  };

  const handleVoeuChange = (event) => {
    setIdVoeu(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            // Envoyer la requête POST au backend pour créer l'intervention
        const response = await axios.post(
            `http://localhost:3000/edition/${selectedEditionId}/interventions`,
            {
            etatInterv,
            dateInterv,
            hDebut,
            hFin,
            nbEleves,
            idAuteur,
            idInterp,
            idAcc,
            idEtablissement
            },
            {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            }
        );
        console.log('Intervention créée avec succès:', response.data);

        const responseVoeu = await axios.post(
            `http://localhost:3000/voeu/${idVoeu}/etat`,
            {
              etatVoeu: 'validé' // Modifier l'état du voeu ici
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );
          console.log('État du voeu modifié avec succès:', responseVoeu.data);
    } catch (error) {
      console.error('Error submitting intervention:', error);
      // Gérer les erreurs de soumission ici
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Proposer une intervention</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="edition" className="block font-semibold">Sélectionner une édition</label>
          <select id="edition" value={selectedEditionId} onChange={(e) => setSelectedEditionId(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Choisir une édition</option>
            {editions.map((edition) => (
              <option key={edition.idedition} value={edition.idedition}>{edition.description}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="etatInterv" className="block font-semibold">État de l'intervention</label>
          <input type="text" id="etatInterv" value={etatInterv} onChange={(e) => setEtatInterv(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="dateInterv" className="block font-semibold">Date de l'intervention</label>
          <input type="date" id="dateInterv" value={dateInterv} onChange={(e) => setDateInterv(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="hDebut" className="block font-semibold">Heure de début</label>
          <input type="time" id="hDebut" value={hDebut} onChange={(e) => setHDebut(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="hFin" className="block font-semibold">Heure de fin</label>
          <input type="time" id="hFin" value={hFin} onChange={(e) => setHFin(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="nbEleves" className="block font-semibold">Nombre d'élèves</label>
          <input type="number" id="nbEleves" value={nbEleves} onChange={(e) => setNbEleves(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="idAuteur" className="block font-semibold">ID de l'auteur</label>
          <input type="text" id="idAuteur" value={idAuteur} onChange={(e) => setIdAuteur(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="idInterp" className="block font-semibold">ID de l'interprète</label>
          <input type="text" id="idInterp" value={idInterp} onChange={(e) => setIdInterp(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="idAcc" className="block font-semibold">ID de l'accompagnateur</label>
          <input type="text" id="idAcc" value={idAcc} onChange={(e) => setIdAcc(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="idEtablissement" className="block font-semibold">ID de l'établissement</label>
          <input type="text" id="idEtablissement" value={idEtablissement} onChange={(e) => setIdEtablissement(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="idVoeu" className="block font-semibold">ID du voeu</label>
                  <select id="idVoeu" value={idVoeu} onChange={handleVoeuChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                      <option value="">Choisir un voeu</option>
                      {voeux
                          .filter(voeu => voeu.etat === 'déposé') // Filtrer les voeux avec l'état "déposé"
                          .map((voeu) => (
                              <option key={voeu.idvoeu} value={voeu.idvoeu}>{voeu.idvoeu} - {voeu.nom}</option>
                          ))}
                  </select>

        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Proposer l'intervention</button>
      </form>
    </div>
  );
};

export default InterventionForm;
