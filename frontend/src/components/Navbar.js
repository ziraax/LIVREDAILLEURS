import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/logout');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="sticky top-0 bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold flex items-center">
            <span>Livre d'Ailleurs</span>
            <span className="ml-8 flex">
              <a href="http://localhost:3001/" className="ml-4 text-gray-300 hover:text-white">Home</a>
              <a href="http://localhost:3001/apropos" className="ml-4 text-gray-300 hover:text-white">À propos</a>
              <a href="http://localhost:3001/contact" className="ml-4 text-gray-300 hover:text-white">Contact</a>
            </span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
