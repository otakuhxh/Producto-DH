import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import '../AddProduct/AddProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialState = {
    name: '',
    description: '',
    category: '',
    city: '',
    rating: 0.0,
    imageUrls: [],
    features: [] // Nuevo: para características seleccionadas
  };

  const [product, setProduct] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]); // Nuevo: todas las características
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFeatures, setLoadingFeatures] = useState(true); // Nuevo: estado para características

  // Cargar categorías y características al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, featuresRes] = await Promise.all([
          api.get('/categories'),
          api.get('/features') // Nuevo: obtener características
        ]);

        setCategories(categoriesRes.data);
        setAvailableFeatures(featuresRes.data);
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoadingCategories(false);
        setLoadingFeatures(false);
      }
    };

    fetchInitialData();
  }, []);

  // Cargar producto cuando ya tenemos las categorías y características
  useEffect(() => {
    if (loadingCategories || loadingFeatures) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/products/${id}`);
        
        if (!response.data?.name) {
          throw new Error('Producto no encontrado');
        }

        setProduct({
          name: response.data.name,
          description: response.data.description,
          category: response.data.category,
          city: response.data.city,
          rating: response.data.rating,
          imageUrls: response.data.imageUrls || [],
          //features: product.features.map(id => ({ id }))
          features: response.data.features|| [] // Nuevo: cargar características seleccionadas
        });

        console.log(response.data);
        // Verificar si la categoría del producto existe en las disponibles
        if (response.data.category && !categories.some(c => c.name === response.data.category)) {
          console.warn(`La categoría "${response.data.category}" no existe en las categorías disponibles`);
        }

      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError(err.response?.data?.message || 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, loadingCategories, loadingFeatures, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Nuevo: manejar selección de características
  const handleFeatureToggle = (featureId) => {
    setProduct(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleDeleteImage = (imageUrl) => {
    if (typeof imageUrl === 'string') {
      setImagesToDelete(prev => [...prev, imageUrl]);
      setProduct(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter(img => img !== imageUrl)
      }));
    } else {
      setSelectedFiles(prev => prev.filter((_, i) => i !== imageUrl));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new FormData();
      
      // Preparar datos del producto (incluyendo características)
      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        city: product.city,
        rating: Number(product.rating),
        imageUrls: product.imageUrls,
        features: product.features.map(featureObj => ({ id: featureObj.id }))
        //features: product.features.map(id => ({ id })) // Nuevo: enviar características
      };
      
      const productBlob = new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      });
      formData.append('product', productBlob);
 
    // Agregar features por separado si es necesario
    /*
    product.features.forEach(featureId => {
      formData.append('features', featureId.toString());
    });*/
      
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      console.log('Datos enviados:', {
      product: productData,
      imageCount: selectedFiles.length
    });

console.log(formData)
console.log(product.features)
console.log(JSON.stringify(productData))

      await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

    // Eliminar imágenes marcadas para borrar
      if (imagesToDelete.length > 0) {
        try {
          await api.delete('/products/images', { 
            data: { images: imagesToDelete } 
          });
        } catch (err) {
          console.error("Error eliminando imágenes físicas:", err);
        }
      }
      
      navigate('/admin');
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err.response?.data?.message || 'Error al actualizar el producto');
    }
  };

  if (isLoading || loadingCategories || loadingFeatures) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin')} className="back-button">
          Volver al Panel
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="add-product">
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="back-button">
            ← Volver al Panel
          </button>
          <h1>Editar Producto</h1>
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
        <h1>Editar Producto</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            step="0.1"
            value={product.rating}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nueva sección de características 
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
        </div>*/}

        <div className="form-group">
  <label>Características:</label>
  <div className="features-container">
    {availableFeatures.map(feature => {
      // Verificación robusta que funciona con:
      // - features: [1, 2, 3] (solo IDs)
      // - features: [{id: 1}, {id: 2}] (objetos)
      const isChecked = product.features.some(f => 
        (typeof f === 'object' ? f.id : f) == feature.id
      );
      
      return (
        <div key={feature.id} className="feature-item">
          <input
            type="checkbox"
            id={`feature-${feature.id}`}
            checked={isChecked}
            onChange={() => handleFeatureToggle(feature.id)}
          />
          <label htmlFor={`feature-${feature.id}`}>
            {feature.name}
          </label>
        </div>
      );
    })}
  </div>
</div>
        
        <div className="form-group">
          <label>Imágenes existentes:</label>
          <div className="image-previews">
            {product.imageUrls.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="image-preview">
                <img 
                  src={`http://localhost:8080${imageUrl}`} 
                  alt={`Imagen ${index + 1} del producto`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
                  }}
                />
                <button 
                  type="button"
                  onClick={() => handleDeleteImage(imageUrl)}
                  className="delete-image-btn"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>Agregar nuevas imágenes:</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          <div className="image-previews">
            {selectedFiles.map((file, index) => (
              <div key={`new-${index}`} className="image-preview">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Vista previa ${index + 1}`}
                />
                <span>{file.name}</span>
                <button 
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="delete-image-btn"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!product.name?.trim() || !product.description?.trim() || !product.category}
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
/*
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import '../AddProduct/AddProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialState = {
    name: '',
    description: '',
    category: '',
    city: '',
    rating: 0.0,
    imageUrls: []
  };

  const [product, setProduct] = useState(initialState);
  const [categories, setCategories] = useState([]); // Estado para categorías
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true); // Estado para carga de categorías

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('Error al cargar las categorías disponibles');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Cargar producto cuando ya tenemos las categorías
  useEffect(() => {
    if (loadingCategories) return; // Esperar a que carguen las categorías

    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/products/${id}`);
        
        if (!response.data?.name) {
          throw new Error('Producto no encontrado');
        }

        setProduct({
          name: response.data.name,
          description: response.data.description,
          category: response.data.category,
          city: response.data.city,
          rating: response.data.rating,
          imageUrls: response.data.imageUrls || []
        });

        // Verificar si la categoría del producto existe en las disponibles
        if (response.data.category && !categories.some(c => c.name === response.data.category)) {
          console.warn(`La categoría "${response.data.category}" no existe en las categorías disponibles`);
        }

      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError(err.response?.data?.message || 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, loadingCategories, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleDeleteImage = (imageUrl) => {
    if (typeof imageUrl === 'string') {
      setImagesToDelete(prev => [...prev, imageUrl]);
      setProduct(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter(img => img !== imageUrl)
      }));
    } else {
      setSelectedFiles(prev => prev.filter((_, i) => i !== imageUrl));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new FormData();
      
      // 1. Preparar datos del producto con las imágenes actualizadas
      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        city: product.city,
        rating: Number(product.rating),
        imageUrls: product.imageUrls
      };
      
      // 2. Agregar el producto como JSON
      const productBlob = new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      });
      formData.append('product', productBlob);
      
      // 3. Agregar nuevas imágenes seleccionadas
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      // 4. Enviar la solicitud de actualización
      await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 5. Eliminar físicamente las imágenes marcadas para borrar
      if (imagesToDelete.length > 0) {
        try {
          await api.delete('/products/images', { 
            data: { images: imagesToDelete } 
          });
        } catch (err) {
          console.error("Error eliminando imágenes físicas:", err);
          // No es crítico si falla, las imágenes ya no están asociadas al producto
        }
      }
      
      navigate('/admin');
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err.response?.data?.message || 'Error al actualizar el producto');
    }
  };

  if (isLoading || loadingCategories) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin')} className="back-button">
          Volver al Panel
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="add-product">
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="back-button">
            ← Volver al Panel
          </button>
          <h1>Editar Producto</h1>
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
        <h1>Editar Producto</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            step="0.1"
            value={product.rating}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Imágenes existentes:</label>
          <div className="image-previews">
            {product.imageUrls.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="image-preview">
                <img 
                  src={`http://localhost:8080${imageUrl}`} 
                  alt={`Imagen ${index + 1} del producto`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
                  }}
                />
                <button 
                  type="button"
                  onClick={() => handleDeleteImage(imageUrl)}
                  className="delete-image-btn"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>Agregar nuevas imágenes:</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          <div className="image-previews">
            {selectedFiles.map((file, index) => (
              <div key={`new-${index}`} className="image-preview">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Vista previa ${index + 1}`}
                />
                <span>{file.name}</span>
                <button 
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="delete-image-btn"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!product.name?.trim() || !product.description?.trim() || !product.category}
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
*/