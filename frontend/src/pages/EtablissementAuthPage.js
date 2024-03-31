import React, { useState } from 'react';
import EtablissementRegisterForm from '../components/EtablissementLoginForm';
import EtablissementLoginForm from '../components/EtablissementRegisterForm';

const EtablissementAuthPage = () => {
  const [isRegisterVisible, setRegisterVisible] = useState(false);

  const toggleFormVisibility = () => {
    setRegisterVisible(!isRegisterVisible);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Etablissement Authentication</h2>
      {/* Conditional rendering based on isRegisterVisible state */}
      {isRegisterVisible ? (
        <EtablissementRegisterForm />
      ) : (
        <EtablissementLoginForm />
      )}
      {/* Button to toggle between register and login forms */}
      <button
        className="mt-4 bg-blue-500 hover:bg-grey-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleFormVisibility}
      >
        {isRegisterVisible ? 'Go to Register' : 'Go to Login'}
      </button>
    </div>
  );
};

export default EtablissementAuthPage;
