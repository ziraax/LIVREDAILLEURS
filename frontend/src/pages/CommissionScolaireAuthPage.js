import React, { useState } from 'react';
import CommissionScolaireLoginForm from '../components/CommissionScolaireLoginForm';
import CommissionScolaireRegisterForm from '../components/CommissionScolaireRegisterForm';

const CommissionScolaireAuthPage = () => {
  const [isRegisterVisible, setRegisterVisible] = useState(false);

  const toggleFormVisibility = () => {
    setRegisterVisible(!isRegisterVisible);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Commission Scolaire Authentication</h2>
      {/* Conditional rendering based on isRegisterVisible state */}
      {isRegisterVisible ? (
        <CommissionScolaireRegisterForm />
      ) : (
        <CommissionScolaireLoginForm />
      )}
      {/* Button to toggle between register and login forms */}
      <button
        className="mt-4 bg-blue-500 hover:bg-grey-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleFormVisibility}
      >
        {isRegisterVisible ? 'Vers inscription' : 'Vers connexion'}
      </button>
    </div>
  );
};

export default CommissionScolaireAuthPage;
