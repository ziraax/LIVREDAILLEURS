import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CommissionScolaireDashboardInfos from '../components/CommissionScolaireDashboardInfos';
import CommissionScolaireCreateEditionForm from '../components/CommissionScolaireCreateEditionForm';
import EditionsList from '../components/EditionsList';

const CommissionScolaireDashboard = () => {
  const [commissionScolaireData, setCommissionScolaireData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    
    // Fetch Commission Scolaire data using the provided id
    const fetchCommissionScolaireData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/commission-scolaire/${id}`);
        setCommissionScolaireData(response.data);
      } catch (error) {
        console.error('Error fetching Commission Scolaire data:', error);
      }
    };

    fetchCommissionScolaireData();
  }, [id]);

  return (
    <div className="container mx-auto mt-8">
      {commissionScolaireData ? (
        <>
          <CommissionScolaireDashboardInfos commissionScolaireData={commissionScolaireData} />
          <EditionsList />
          <CommissionScolaireCreateEditionForm />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CommissionScolaireDashboard;
