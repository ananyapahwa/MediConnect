import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute><Layout><Appointments /></Layout></PrivateRoute>} />
        <Route path="/doctors" element={<PrivateRoute><Layout><Doctors /></Layout></PrivateRoute>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/doctor-dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
