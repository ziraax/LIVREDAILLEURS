import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const AuteurLoginForm = () => {
  const [formData, setFormData] = useState({
    identifiant: '',
    mdp: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login/auteur', formData, { withCredentials: true });
      console.log("response data", response.data);
      const { idauteur } = response.data;
      setError('');
      navigate(`/auteurdashboard/${idauteur}`); // Redirect to AuteurDashboard
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Connexion</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifiant">
            Identifiant
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            id="identifiant"
            name="identifiant"
            value={formData.identifiant}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mdp">
            Mot de passe
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="password"
            id="mdp"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            required
          />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default AuteurLoginForm;
