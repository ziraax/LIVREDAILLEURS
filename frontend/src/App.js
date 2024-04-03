import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EtablissementAuthPage from './pages/EtablissementAuthPage';
import EtablissementDashboard from './pages/EtablissementDashboard';

import CommissionScolaireAuthPage from './pages/CommissionScolaireAuthPage';
import CommissionScolaireDashboard from './pages/CommissionScolaireDashboard';

import AuteurAuthPage from './pages/AuteurAuthPage';
import AuteurDashboard from './pages/AuteurDashboard';

import APropos from './pages/APropos'
import Contact from './pages/Contact'


const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={ <HomePage /> } />

          <Route path="/apropos" element={ <APropos /> } />
          <Route path="/contact" element={ <Contact /> } />


          <Route path="/etablissement" element={ <EtablissementAuthPage /> } />
          <Route path="/etablissementdashboard/:id" element={<EtablissementDashboard />}  />

          <Route path="/commissionscolaire" element={ <CommissionScolaireAuthPage /> } />
          <Route path="/commissionscolairedashboard/:id" element={<CommissionScolaireDashboard />}  />

          <Route path="/auteur" element={ <AuteurAuthPage /> } />
          <Route path="/auteurdashboard/:id" element={<AuteurDashboard />}  />

        </Routes>
    </Router>
  );
};

export default App;
