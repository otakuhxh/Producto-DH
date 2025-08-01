import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AddProduct/AddProduct.css';

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      
      // Agregar imagen si existe
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Enviar al backend
      await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/categories');
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || 'Error al agregar la categoría');
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
        <h1>Agregar Nueva Categoría</h1>
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
            required
          />
          {selectedFile && (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Vista previa"
              />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!category.name || !category.description}
          >
            Guardar Categoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;