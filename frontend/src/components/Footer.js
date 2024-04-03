import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleAProposClick = () => {
    navigate('/apropos');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleHomeClick = () => {
    navigate('/');
  }

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="mr-4 cursor-pointer" onClick={handleHomeClick}>Home</span>
            <span className="mr-4 cursor-pointer" onClick={handleAProposClick}>A propos</span>
            <span className="mr-4 cursor-pointer" onClick={handleContactClick}>Contact</span>
          </div>
          <div>&copy; 2024 Livre d'Ailleurs. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
