
import React, { useEffect, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AdminPanel/AdminPanel.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/auth/users/${userId}/role?newRole=${newRole}`);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h2>Panel de administración no disponible en dispositivos móviles</h2>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <nav className="admin-menu">
        <Link to="/admin/" className="admin-link">Productos</Link>
        <Link to="/admin/features" className="admin-link">Caracteristicas</Link>
        <Link to="/admin/categories" className="admin-link">Categorias</Link>
        <Link to="/admin/users" className="admin-link active">Usuarios</Link>
      </nav>
      
      <div className="product-list">
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              {/*<th>Acciones</th>*/}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </td>
                {/*<td>
                  <button 
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="action-btn"
                  >
                    Detalles
                  </button>
                </td>*/}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

/*
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AdminPanel/AdminPanel.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('No se pudieron cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Gestión de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role || 'USER'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
/*
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AdminPanel/AdminPanel.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Iniciando petición GET a /auth/users");
        const response = await api.get('/auth/users');
        
        console.log("Respuesta recibida:", response);
        
        if (!response.data) {
          throw new Error("La respuesta no contiene datos");
        }
        
        setUsers(response.data);
      } catch (error) {
        console.error("Error completo:", error);
        console.error("Detalles del error:", {
          message: error.message,
          response: error.response,
          stack: error.stack
        });
        setError('No se pudieron cargar los usuarios. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Gestión de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role || 'USER'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;*/