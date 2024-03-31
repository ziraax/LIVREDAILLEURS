import React, { useState } from 'react';
import axios from 'axios';

const CommissionScolaireEditionForm = () => {
  const [formData, setFormData] = useState({
    annee: '',
    description: '',
    debutInscriptions: '',
    finInscriptions: '',
    debutVoeux: '',
    finVoeux: '',
    debutFestival: '',
    finFestival: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("cookies", document.cookie);
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      console.log("token", token);
      const response = await axios.post(
        'http://localhost:3000/edition',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      console.log(response.data); // Handle success
      // Clear the form after successful submission
      setFormData({
        annee: '',
        description: '',
        debutInscriptions: '',
        finInscriptions: '',
        debutVoeux: '',
        finVoeux: '',
        debutFestival: '',
        finFestival: ''
      });
      setError('');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Créer une édition</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields for edition details */}
        <input
          type="text"
          name="annee"
          value={formData.annee}
          onChange={handleChange}
          placeholder="Année"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows="4"
        />
        <label htmlFor="debutInscriptions" className="block text-gray-700 text-sm font-bold mb-2">Début des inscriptions :</label>
        <input
          type="date"
          name="debutInscriptions"
          value={formData.debutInscriptions}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <label htmlFor="finInscriptions" className="block text-gray-700 text-sm font-bold mb-2">Fin des inscriptions :</label>
        <input
          type="date"
          name="finInscriptions"
          value={formData.finInscriptions}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <label htmlFor="debutVoeux" className="block text-gray-700 text-sm font-bold mb-2">Début des voeux :</label>
        <input
          type="date"
          name="debutVoeux"
          value={formData.debutVoeux}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <label htmlFor="finVoeux" className="block text-gray-700 text-sm font-bold mb-2">Fin des voeux :</label>
        <input
          type="date"
          name="finVoeux"
          value={formData.finVoeux}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <label htmlFor="debutFestival" className="block text-gray-700 text-sm font-bold mb-2">Début du festival  :</label>
        <input
          type="date"
          name="debutFestival"
          value={formData.debutFestival}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <label htmlFor="finFestival" className="block text-gray-700 text-sm font-bold mb-2">Fin du festival :</label>
        <input
          type="date"
          name="finFestival"
          value={formData.finFestival}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Créer l'édition
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CommissionScolaireEditionForm;
