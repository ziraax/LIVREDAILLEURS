import React, { useState } from 'react';
import axios from 'axios';

const AddAccompagnateur = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numTel: '',
    mail: '',
    mdp: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register/accompagnateur', formData);
      setSuccessMessage(response.data.message);
      setError('');
      // Clear the form after successful submission
      setFormData({
        nom: '',
        prenom: '',
        numTel: '',
        mail: '',
        mdp: ''
      });
    } catch (error) {
      setError(error.response.data.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Ajouter un accompagnateur</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields for accompagnateur details */}
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          placeholder="Prénom"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="tel"
          name="numTel"
          value={formData.numTel}
          onChange={handleChange}
          placeholder="Numéro de téléphone"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          name="mdp"
          value={formData.mdp}
          onChange={handleChange}
          placeholder="Mot de passe"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Ajouter l'accompagnateur
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default AddAccompagnateur;
