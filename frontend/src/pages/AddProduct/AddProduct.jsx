import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'hotel',
    city: '',
    rating: 0,
    images: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    // Convertir FileList a array y seleccionar máximo 5 imágenes
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData();
    
    // 1. Crear objeto producto y convertirlo a JSON
    const productData = {
      name: product.name,
      description: product.description,
      category: product.category,
      city: product.city,
      rating: product.rating
    };
    
    // 2. Agregar el producto como JSON
    formData.append('product', new Blob([JSON.stringify(productData)], {
      type: 'application/json'
    }));
    
    // 3. Agregar imágenes (si existen)
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    // 4. Enviar al backend
   /* const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });*/
    
    const response = await api.post('/products', formData);

    console.log('Producto creado:', response.data);

    navigate('/admin');
  } catch (err) {
    console.error('Error detallado:', err);
    setError(err.response?.data?.message || 'Error al agregar el producto');
  }
};
  return (
    <div className="add-product">
      <div className="header-actions">
        <button 
          onClick={() => navigate('/admin')} 
          className="back-button"
        >
          ← Volver al Panel
        </button>
        <h1>Agregar Nuevo Producto</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Campos existentes del formulario */}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Categoría:</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="hotel">Hotel</option>
            <option value="apartment">Departamento</option>
            <option value="bed_and_breakfast">Bed and Breakfast</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Ciudad:</label>
          <input
            type="text"
            name="city"
            value={product.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Rating (1-5):</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={product.rating}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Nuevo campo para imágenes */}
        <div className="form-group">
          <label>Imágenes:</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            required
          />
          <div className="image-previews">
            {selectedFiles.map((file, index) => (
              <div key={index} className="image-preview">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Vista previa ${index + 1}`}
                />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!product.name || !product.description}
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;