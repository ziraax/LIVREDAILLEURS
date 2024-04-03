import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EtablissementDashboardInfos from '../components/EtablissementDashboardInfos';
import PropositionVoeuxForm from '../components/PropositionVoeuxForm';
import ReferentsList from '../components/ReferentsList';
import AddReferentForm from '../components/ReferentAddForm';
import InterventionsList from '../components/InterventionsList';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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
    <div className="container mx-auto">
      {etablissementData ? (
        <>
          <Navbar />
          <br></br>          <br></br>   

          <EtablissementDashboardInfos etablissementData={etablissementData} />
          <br></br>
          <ReferentsList idEtablissement={idEtablissement} />
          <AddReferentForm idEtablissement={idEtablissement} />

          <br></br>

          <InterventionsList idEtablissement={idEtablissement} />

          <PropositionVoeuxForm idEtablissement={idEtablissement} />
          
          <br></br>          <br></br>          <br></br>
          <Footer />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EtablissementDashboard;
