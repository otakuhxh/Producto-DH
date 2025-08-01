import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import '../AddProduct/AddProduct.css';

const EditFeature = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feature, setFeature] = useState({
    name: '',
    icon: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const response = await api.get(`/features/${id}`);
        setFeature(response.data);
      } catch (error) {
        console.error('Error fetching feature:', error);
        setError('Error al cargar la característica');
      }
    };
    
    fetchFeature();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Crear FormData para el envío
      const formData = new FormData();
      formData.append('name', feature.name);
      formData.append('icon', feature.icon);

      // Configurar headers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      // Enviar al backend
      const response = await api.put(`/features/${id}`, formData, config);
      
      if (response.status === 200) {
        navigate('/admin/features');
      } else {
        setError('Error al actualizar la característica');
      }
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || 'Error al actualizar la característica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="header-actions">
        <button 
          onClick={() => navigate('/admin/features')} 
          className="back-button"
        >
          ← Volver al Panel
        </button>
        <h1>Editar Característica</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={feature.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Ícono (código o URL):</label>
          <input
            type="text"
            name="icon"
            value={feature.icon}
            onChange={handleChange}
            placeholder="Ej: wifi, pool, o URL de imagen"
            required
          />
          <small className="hint">
            Usa nombres de íconos (ej: "wifi", "pool") o URLs de imágenes
          </small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!feature.name || !feature.icon || loading}
          >
            {loading ? 'Guardando...' : 'Actualizar Característica'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFeature;