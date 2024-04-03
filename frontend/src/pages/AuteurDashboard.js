import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuteurDashboardInfos from '../components/AuteurDashboardInfos';
import PropositionOuvrageForm from '../components/PropositionOuvrageForm';
import EditionsList from '../components/EditionsList';
import OuvragesListAuteur from '../components/OuvragesListAuteur';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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
    <div className="container mx-auto">
      {auteurData ? (
        <>
          <Navbar />
          <br></br>          <br></br>   
          <AuteurDashboardInfos auteurData={auteurData} />
          <EditionsList />
          <OuvragesListAuteur idAuteur={idAuteur}/>
          <PropositionOuvrageForm />

          
          <br></br>          <br></br>          <br></br>
          <Footer />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AuteurDashboard;
