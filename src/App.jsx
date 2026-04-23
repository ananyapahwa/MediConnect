import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PatientHome from './pages/PatientHome';
import DoctorHome from './pages/DoctorHome';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import Chat from './pages/Chat';
import Prescriptions from './pages/Prescriptions';
import PrivateRoute from './components/PrivateRoute';

// Helper component to redirect root path based on role
const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'doctor') {
    return <Navigate to="/doctor-home" replace />;
  }

  return <Navigate to="/patient-home" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Patient Routes */}
        <Route path="/patient-home" element={<PrivateRoute allowedRoles={['patient']}><Layout><PatientHome /></Layout></PrivateRoute>} />
        <Route path="/doctors" element={<PrivateRoute allowedRoles={['patient']}><Layout><Doctors /></Layout></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute allowedRoles={['patient']}><Layout><Appointments /></Layout></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute allowedRoles={['patient']}><Layout><Chat /></Layout></PrivateRoute>} />
        <Route path="/prescriptions" element={<PrivateRoute allowedRoles={['patient']}><Layout><Prescriptions /></Layout></PrivateRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor-home" element={<PrivateRoute allowedRoles={['doctor']}><Layout><DoctorHome /></Layout></PrivateRoute>} />
        <Route path="/doctor-dashboard" element={<PrivateRoute allowedRoles={['doctor']}><DoctorDashboard /></PrivateRoute>} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
