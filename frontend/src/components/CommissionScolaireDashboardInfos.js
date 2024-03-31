import React from 'react';

const CommissionScolaireDashboardInfos = ({ commissionScolaireData }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold bg-gray-800 text-white p-4">Informations Commission Scolaire</h1>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Identifiant :</p>
          <p>{commissionScolaireData.identifiant}</p>
        </div>
        <div>
          <p className="font-bold">Email :</p>
          <p>{commissionScolaireData.mail}</p>
        </div>
        <div>
          <p className="font-bold">Prénom responsable :</p>
          <p>{commissionScolaireData.prenomresp}</p>
        </div>
        <div>
          <p className="font-bold">Nom responsable :</p>
          <p>{commissionScolaireData.nomresp}</p>
        </div>
        <div>
          <p className="font-bold">Numéro de téléphone :</p>
          <p>{commissionScolaireData.numtel}</p>
        </div>
        <div>
          <p className="font-bold">Adresse :</p>
          <p>{commissionScolaireData.adresse}</p>
        </div>
      </div>
    </div>
  );
};

export default CommissionScolaireDashboardInfos;
