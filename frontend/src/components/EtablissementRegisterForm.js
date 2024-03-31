import React, { useState } from 'react';
import axios from 'axios';

const EtablissementRegisterForm = () => {
  const [formData, setFormData] = useState({
    identifiant: '',
    mdp: '',
    nom: '',
    type: '',
    num_tel: '',
    mail: '',
    adresse: '',
    localisation: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/register/etablissement',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data); // Handle success
    } catch (error) {
      setError(error.response.data.message);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Etablissement Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="identifiant"
          value={formData.identifiant}
          onChange={handleChange}
          placeholder="Identifiant"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="mdp"
          value={formData.mdp}
          onChange={handleChange}
          placeholder="Password"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        >
            <option value="">Type de votre établissement</option>
            <option value="université">Université</option>
            <option value="lycée général">Lycée général</option>
            <option value="lycée professionnel">Lycée professionnel</option>
            <option value="collège">Collège</option>
            <option value="école primaire">École primaire</option>
            <option value="école maternelle">École maternelle</option>
            <option value="médico-sociaux">Médico-sociaux</option>
            <option value="pénitentiaire">Pénitentiaire</option>
        </select>

        <input
          type="text"
          name="num_tel"
          value={formData.num_tel}
          onChange={handleChange}
          placeholder="Numéro de téléphone"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          placeholder="Adresse email"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          placeholder="Adresse"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="localisation"
          value={formData.localisation}
          onChange={handleChange}
          placeholder="Localisation"
          className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default EtablissementRegisterForm;
