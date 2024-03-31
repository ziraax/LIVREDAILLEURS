import React from 'react';

const AuteurDashboardInfos = ({ auteurData }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold bg-gray-800 text-white p-4">Informations Auteur</h1>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Identifiant :</p>
          <p>{auteurData.identifiant}</p>
        </div>
        <div>
          <p className="font-bold">Nom :</p>
          <p>{auteurData.nom}</p>
        </div>
        <div>
          <p className="font-bold">Prénom :</p>
          <p>{auteurData.prenom}</p>
        </div>
        <div>
          <p className="font-bold">Numéro de téléphone :</p>
          <p>{auteurData.numtel}</p>
        </div>
        <div>
          <p className="font-bold">Adresse e-mail :</p>
          <p>{auteurData.mail}</p>
        </div>
        <div>
          <p className="font-bold">Adresse :</p>
          <p>{auteurData.adresse}</p>
        </div>
        <div>
          <p className="font-bold">Localisation :</p>
          <p>{auteurData.localisation}</p>
        </div>
        <div>
          <p className="font-bold">Langues :</p>
          <ul className="list-disc list-inside">
            {auteurData.langues.map((langue, index) => (
              <li key={index}>{langue}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuteurDashboardInfos;
