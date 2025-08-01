

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import '../AddProduct/AddProduct.css';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get(`/categories/${id}`);
        setCategory(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
    
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Agregar datos de la categoría
      formData.append('name', category.name);
      formData.append('description', category.description);
      
      // Agregar nueva imagen si existe
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Enviar al backend
      await api.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/categories');
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || 'Error al actualizar la categoría');
    }
  };

  return (
    <div className="add-product">
      <div className="header-actions">
        <button 
          onClick={() => navigate('/admin/categories')} 
          className="back-button"
        >
          ← Volver al Panel
        </button>
        <h1>Editar Categoría</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Imagen:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="image-previews">
            {category.imageUrl && (
              <div className="image-preview">
                <span>Imagen actual</span>
                <img 
                  src={`http://localhost:8080${category.imageUrl}`} 
                  alt="Imagen actual"
                />
              </div>
            )}
            {selectedFile && (
              <div className="image-preview">
                 <span>Nueva imagen</span>
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Nueva imagen"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!category.name || !category.description}
          >
            Actualizar Categoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
