import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

    if (!token) {
        return <Navigate to="" replace />
    }
    
    return <Outlet/>
}