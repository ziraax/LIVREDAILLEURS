// EtablissementDashboardInfos.jsx

import React from 'react';

const EtablissementDashboardInfos = ({ etablissementData }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold bg-gray-800 text-white p-4">Information établissement</h1>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Identifiant :</p>
          <p>{etablissementData.identifiant}</p>
        </div>
        <div>
          <p className="font-bold">Nom :</p>
          <p>{etablissementData.nom}</p>
        </div>
        <div>
          <p className="font-bold">Type :</p>
          <p>{etablissementData.type}</p>
        </div>
        <div>
          <p className="font-bold">Numéro de téléphone :</p>
          <p>{etablissementData.numtel}</p>
        </div>
        <div>
          <p className="font-bold">Adresse e-mail :</p>
          <p>{etablissementData.mail}</p>
        </div>
        <div>
          <p className="font-bold">Adresse :</p>
          <p>{etablissementData.adresse}</p>
        </div>
        <div>
          <p className="font-bold">Localisation :</p>
          <p>{etablissementData.localisation}</p>
        </div>
      </div>
    </div>
  );
};

export default EtablissementDashboardInfos;
