import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuteurDashboardInfos from '../components/AuteurDashboardInfos';
import PropositionOuvrageForm from '../components/PropositionOuvrageForm';
import EditionsList from '../components/EditionsList';


const AuteurDashboard = () => {
  const [auteurData, setAuteurData] = useState(null);
  const [idAuteur, setIdAuteur] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setIdAuteur(id);
  }, [id]);

  useEffect(() => {
    if (idAuteur) {
      // Fetch auteur data using the provided idAuteur
      const fetchAuteurData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/auteur/${idAuteur}`);
          setAuteurData(response.data);
        } catch (error) {
          console.error('Error fetching auteur data:', error);
        }
      };

      fetchAuteurData();
    }
  }, [idAuteur]);

  return (
    <div className="container mx-auto mt-8">
      {auteurData ? (
        <>
          <AuteurDashboardInfos auteurData={auteurData} />
          <EditionsList />
          <PropositionOuvrageForm />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AuteurDashboard;
