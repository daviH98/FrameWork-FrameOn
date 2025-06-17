import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminRouter = () => {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    
    try {
        if (user.role !== 'admin') {
          return <Navigate to="/" replace />;
        }
    
        return <Outlet />;
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return <Navigate to="/login" replace />;
      }
}