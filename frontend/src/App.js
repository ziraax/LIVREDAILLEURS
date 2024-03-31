import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EtablissementAuthPage from './pages/EtablissementAuthPage';
import EtablissementDashboard from './pages/EtablissementDashboard';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={ <HomePage /> } />
          <Route path="/etablissement" element={ <EtablissementAuthPage /> } />
          <Route path="/EtablissementDashboard/:id" element={<EtablissementDashboard />}  />
        </Routes>
    </Router>
  );
};

export default App;
