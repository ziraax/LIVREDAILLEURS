import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VoeuxForm = ({ idEtablissement }) => {
  const [editions, setEditions] = useState([]);
  const [ouvrages, setOuvrages] = useState([]);
  const [referents, setReferents] = useState([]);
  const [selectedEditionId, setSelectedEditionId] = useState('');
  const [selectedOuvrageId, setSelectedOuvrageId] = useState('');
  const [selectedReferentId, setSelectedReferentId] = useState('');
  const [prio, setPrio] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    const fetchOuvrages = async () => {
      if (selectedEditionId) {
        try {
          const response = await axios.get(`http://localhost:3000/edition/${selectedEditionId}/ouvrages`);
          console.log(response.data);
          setOuvrages(response.data.ouvrages);
        } catch (error) {
          console.error('Error fetching ouvrages:', error);
        }
      }
    };
  
    fetchOuvrages();
  }, [selectedEditionId]);
  

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      const response = await axios.post(`http://localhost:3000/edition/${selectedEditionId}/etablissement/${idEtablissement}/voeux`, {
        idOuvrage: selectedOuvrageId,
        idRef: selectedReferentId,
        prio,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setSuccessMessage('Voeu soumis avec succès !');
      setSelectedEditionId('');
      setSelectedOuvrageId('');
      setSelectedReferentId('');
      setPrio('');
      setError('');
      // Afficher un message de succès
    } catch (error) {
      console.error('Error submitting voeu:', error);
      setError('Erreur lors de la soumission du voeu');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Soumettre un voeu</h2>
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
        {/* Champs pour sélectionner l'ouvrage */}
        <div>
          <label htmlFor="ouvrage" className="block font-semibold">Sélectionner un ouvrage</label>
          <select id="ouvrage" value={selectedOuvrageId} onChange={(e) => setSelectedOuvrageId(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Choisissez d'abord une édition</option>
            {ouvrages && ouvrages.map((ouvrages) => (
              <option key={ouvrages.idouvrage} value={ouvrages.idouvrage}>{ouvrages.titre}</option>
            ))}
          </select>
        </div>
        {/* Champs pour sélectionner le référent */}
        <div>
          <label htmlFor="referent" className="block font-semibold">Sélectionner un référent</label>
          <select id="referent" value={selectedReferentId} onChange={(e) => setSelectedReferentId(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Choisir un référent</option>
            {referents.map((referent) => (
              <option key={referent.idref} value={referent.idref}>{`${referent.nom} ${referent.prenom}`}</option>
            ))}
          </select>
        </div>
        {/* Champ pour saisir la priorité */}
        <div>
          <label htmlFor="prio" className="block font-semibold">Priorité</label>
          <input type="number" id="prio" value={prio} onChange={(e) => setPrio(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Soumettre le voeu</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default VoeuxForm;
