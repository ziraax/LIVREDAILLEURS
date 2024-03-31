import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EtablissementDashboardInfos from '../components/EtablissementDashboardInfos';

const EtablissementDashboard = () => {
  const [etablissementData, setEtablissementData] = useState(null);
  const [idEtablissement, setIdEtablissement] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setIdEtablissement(id);
  }, [id]);

  useEffect(() => {
    if (idEtablissement) {
      // Fetch etablissement data using the provided idEtablissement
      const fetchEtablissementData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/etablissement/${idEtablissement}`);
          setEtablissementData(response.data);
        } catch (error) {
          console.error('Error fetching etablissement data:', error);
        }
      };

      fetchEtablissementData();
    }
  }, [idEtablissement]);

  return (
    <div className="container mx-auto mt-8">
      {etablissementData ? (
        <EtablissementDashboardInfos etablissementData={etablissementData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EtablissementDashboard;
