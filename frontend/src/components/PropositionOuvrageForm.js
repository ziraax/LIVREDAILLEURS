import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropositionOuvrageForm = () => {
  const [editions, setEditions] = useState([]);
  const [selectedEditionId, setSelectedEditionId] = useState('');
  const [ouvrageDetails, setOuvrageDetails] = useState({
    titre: '',
    classesConcernees: [],
    publicsCibles: [],
    description: '',
    langue: '',
  });

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

  const handleEditionChange = (event) => {
    setSelectedEditionId(event.target.value);
  };

  const handleOuvrageDetailsChange = (event) => {
    const { name, value } = event.target;
    setOuvrageDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setOuvrageDetails((prevDetails) => ({
      ...prevDetails,
      [name]: checked ? [...prevDetails[name], event.target.value] : prevDetails[name].filter(item => item !== event.target.value)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("cookies", document.cookie);
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      console.log("token", token);

      await axios.post(`http://localhost:3000/edition/${selectedEditionId}/ouvrage`, {
        ...ouvrageDetails,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setOuvrageDetails({
        titre: '',
        classesConcernees: [],
        publicsCibles: [],
        description: '',
        langue: '',
      });

    } catch (error) {
      console.error('Error submitting ouvrage:', error);
      // Ajouter ici la logique pour afficher un message d'erreur si nécessaire
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Proposer un ouvrage</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edition" className="block font-semibold">Sélectionner une édition</label>
          <select id="edition" value={selectedEditionId} onChange={handleEditionChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Choisir une édition</option>
            {editions.map((edition) => (
              <option key={edition.idedition} value={edition.idedition}>{edition.description}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="titre" className="block font-semibold">Titre de l'ouvrage</label>
          <input type="text" id="titre" name="titre" value={ouvrageDetails.titre} onChange={handleOuvrageDetailsChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="description" className="block font-semibold">Description de l'ouvrage</label>
          <textarea id="description" name="description" value={ouvrageDetails.description} onChange={handleOuvrageDetailsChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="langue" className="block font-semibold">Langue de l'ouvrage</label>
          <input type="text" id="langue" name="langue" value={ouvrageDetails.langue} onChange={handleOuvrageDetailsChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block font-semibold">Classes concernées</label>
          {['université', 'lycée général', 'lycée professionnel', 'collège', 'école primaire', 'école maternelle', 'médico-sociaux', 'pénitentiaire'].map(option => (
            <div key={option} className="flex items-center">
              <input type="checkbox" id={option} name="classesConcernees" value={option} checked={ouvrageDetails.classesConcernees.includes(option)} onChange={handleCheckboxChange} className="mr-2" />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
        <div>
          <label className="block font-semibold">Publics cibles</label>
          {['jeune enfant', 'enfant', 'ado', 'jeune adulte', 'adulte'].map(option => (
            <div key={option} className="flex items-center">
              <input type="checkbox" id={option} name="publicsCibles" value={option} checked={ouvrageDetails.publicsCibles.includes(option)} onChange={handleCheckboxChange} className="mr-2" />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Proposer l'ouvrage</button>
      </form>
    </div>
  );
};

export default PropositionOuvrageForm;
