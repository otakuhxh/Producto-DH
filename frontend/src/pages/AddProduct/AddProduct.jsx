import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AddProduct.css';

const AddProduct = () => {
  // Estados existentes (no modificados)
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    city: '',
    rating: 0,
    images: [],
    features: [] // Nuevo: para guardar IDs de características seleccionadas
  });
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Nuevo estado para características disponibles
  const [availableFeatures, setAvailableFeatures] = useState([]);

  const navigate = useNavigate();

  // Efecto para cargar datos (modificado para incluir características)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías y características en paralelo
        const [categoriesResponse, featuresResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/features') // Asume que tienes este endpoint
        ]);

        setCategories(categoriesResponse.data);
        setAvailableFeatures(featuresResponse.data);

        if (categoriesResponse.data.length > 0) {
          setProduct(prev => ({
            ...prev,
            category: categoriesResponse.data[0].name
          }));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejadores existentes (no modificados)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Nuevo manejador para características
  const handleFeatureToggle = (featureId) => {
    setProduct(prev => {
      const isSelected = prev.features.includes(featureId);
      return {
        ...prev,
        features: isSelected
          ? prev.features.filter(id => id !== featureId)
          : [...prev.features, featureId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
     /* const formData = new FormData();
      
      // Preparar datos del producto (incluyendo características)
      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        city: product.city,
        rating: product.rating,
        features: product.features.map(id => ({ id })) // Formato esperado por el backend
      };
      
      formData.append('product', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      }));
      
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      await api.post('/products', formData);
      navigate('/admin');*/

      const formData = new FormData();

      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        city: product.city,
        rating: product.rating,
        //features: product.features.map(id => ({ id }))
      };
      
      formData.append('product', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      }));
      
       // Agregar features por separado si es necesario
      product.features.forEach(featureId => {
      formData.append('features', featureId.toString());
    });
    
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/products', formData);
      console.log('Producto creado:', response.data);
      navigate('/admin');
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Error al guardar el producto');
    }
  };

  // Renderizado existente (con añadido de características)
  if (loading) {
    return (
      <div className="add-product">
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="back-button">
            ← Volver al Panel
          </button>
          <h1>Agregar Nuevo Producto</h1>
        </div>
        <div className="loading-message">Cargando datos...</div>
      </div>
    );
  }

  if (categories.length === 0) {
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
        <div className="error-message">
          No hay categorías disponibles. Por favor, crea al menos una categoría primero.
          <button 
            onClick={() => navigate('/admin/add-category')}
            className="submit-btn"
            style={{ marginTop: '1rem' }}
          >
            Crear Categoría
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product">
      <div className="header-actions">
        <button onClick={() => navigate('/admin')} className="back-button">
          ← Volver al Panel
        </button>
        <h1>Agregar Nuevo Producto</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Campos existentes (sin modificar) */}
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
            required
          >
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
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

        {/* Nueva sección de características */}
        <div className="form-group">
          <label>Características:</label>
          <div className="features-container">
            {availableFeatures.map(feature => (
              <div key={feature.id} className="feature-item">
                <input
                  type="checkbox"
                  id={`feature-${feature.id}`}
                  checked={product.features.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                />
                <label htmlFor={`feature-${feature.id}`}>
                  {feature.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
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
        
        <button type="submit" className="submit-btn">
          Guardar Producto
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '', // Ahora no tiene valor por defecto
    city: '',
    rating: 0,
    images: []
  });
  const [categories, setCategories] = useState([]); // Estado para almacenar categorías
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar carga
  const navigate = useNavigate();

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        
        // Si hay categorías, seleccionar la primera por defecto
        if (response.data.length > 0) {
          setProduct(prev => ({
            ...prev,
            category: response.data[0].name
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        city: product.city,
        rating: product.rating
      };
      
      formData.append('product', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      }));
      
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/products', formData);
      console.log('Producto creado:', response.data);
      navigate('/admin');
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || 'Error al agregar el producto');
    }
  };

  if (loading) {
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
        <div className="loading-message">Cargando categorías...</div>
      </div>
    );
  }

  if (categories.length === 0) {
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
        <div className="error-message">
          No hay categorías disponibles. Por favor, crea al menos una categoría primero.
          <button 
            onClick={() => navigate('/admin/add-category')}
            className="submit-btn"
            style={{ marginTop: '1rem' }}
          >
            Crear Categoría
          </button>
        </div>
      </div>
    );
  }

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
            required
          >
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
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
            disabled={!product.name || !product.description || !product.category}
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
*/