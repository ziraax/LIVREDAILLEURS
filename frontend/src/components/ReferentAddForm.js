// AddReferentForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddReferentForm = ({ idEtablissement }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numTel, setNumTel] = useState('');
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      const response = await axios.post(`http://localhost:3000/referents`, {
        nom,
        prenom,
        numTel,
        mail,
        mdp
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setMessage(response.data.message);
      // Réinitialiser les champs
      setNom('');
      setPrenom('');
      setNumTel('');
      setMail('');
      setMdp('');
    } catch (error) {
      console.error('Error adding referent:', error);
      setMessage('Erreur lors de l\'ajout du référent');
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-2">Ajouter un référent</h2>
      {message && <p className="text-green-500 mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2" />
        <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2" />
        <input type="text" placeholder="Numéro de téléphone" value={numTel} onChange={(e) => setNumTel(e.target.value)} className="block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2" />
        <input type="text" placeholder="Email" value={mail} onChange={(e) => setMail(e.target.value)} className="block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2" />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} className="block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Ajouter</button>
      </form>
    </div>
  );
};

export default AddReferentForm;
