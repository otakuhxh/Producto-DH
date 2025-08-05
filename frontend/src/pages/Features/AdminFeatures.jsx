import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AdminPanel/AdminPanel.css';

const AdminFeatures = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.get('/features');
        setFeatures(response.data);
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatures();
  }, []);

  const handleDelete = async (featureId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta característica?')) {
      try {
        await api.delete(`/features/${featureId}`);
        setFeatures(features.filter(f => f.id !== featureId));
        alert('Característica eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting feature:', error);
        alert('Error al eliminar la característica');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando características...</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <nav className="admin-menu">
        <Link to="/admin" className="admin-link">Productos</Link>
        <Link to="/admin/features" className="admin-link active">Características</Link>
        <Link to="/admin/categories" className="admin-link">Categorías</Link>
        <Link to="/admin/users" className="admin-link">Usuarios</Link>
      </nav>

      <Link to="/admin/add-feature" className="admin-link">+ Nueva Característica</Link>
      <br /><br />
      
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ícono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature.id}>
                <td>{feature.id}</td>
                <td>{feature.name}</td>
                <td>
                  <span className="feature-icon">
                    {feature.icon.startsWith('http') ? (
                      <img src={feature.icon} alt={feature.name} />
                    ) : (
                      <i className={`icon-${feature.icon}`}>{feature.icon}</i>
                    )}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/admin/edit-feature/${feature.id}`)}
                    className="delete-btn"
                  >
                    Modificar
                  </button>
                  <button 
                    onClick={() => handleDelete(feature.id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeatures;