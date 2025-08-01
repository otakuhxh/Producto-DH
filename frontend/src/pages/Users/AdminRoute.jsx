// src/pages/Users/AdminRoute.jsx
/*import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
*/

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { verifyAdminStatus } from '../../services/authService';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.email) {
          setIsAdmin(false);
          return;
        }

        const response = await verifyAdminStatus(userData.email);
        setIsAdmin(response.isAdmin);
        
        // Actualizar localStorage con los últimos datos
        if (response.isAdmin) {
          localStorage.setItem('user', JSON.stringify({
            ...userData,
            role: 'ADMIN'
          }));
        }
      } catch (error) {
        console.error("Error verificando estado de admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [location.pathname]); // Se ejecuta cada vez que cambia la ruta

  if (loading) {
    return (
      <div className="loading-admin-check">
        <p>Verificando permisos de administrador...</p>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;