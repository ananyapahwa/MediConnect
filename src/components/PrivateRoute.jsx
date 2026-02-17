import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If allowedRoles is specified, check if user's role is allowed
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            // Redirect to appropriate home based on user's actual role
            const redirectPath = user.role === 'doctor' ? '/doctor-home' : '/patient-home';
            return <Navigate to={redirectPath} replace />;
        }
    }

    return children;
};

export default PrivateRoute;
