import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AddProduct/AddProduct.css';

const AddFeature = () => {
  const [feature, setFeature] = useState({
    name: '',
    icon: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!feature.name || !feature.icon) {
      setError('Por favor completa todos los campos');
      return;
    }

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
      const response = await api.post('/features', formData, config);
      
      if (response.status === 201) {
        navigate('/admin/features');
      } else {
        setError('Error al crear la característica');
      }
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || 'Error al agregar la característica');
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
        <h1>Agregar Nueva Característica</h1>
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
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!feature.name || !feature.icon}
          >
            Guardar Característica
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFeature;