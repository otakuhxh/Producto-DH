import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CategoriesSection.css';

const CategoriesSection = ({ onCategoryClick, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (loading) return <div className="loading">Cargando categorías...</div>;

  return (
    <section className="categories-section">
      <h2>Buscar por tipo de alojamiento</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`category-card ${
              selectedCategory === category.name ? 'category-selected' : ''
            }`}
            onClick={() => onCategoryClick(category.name)}
          >
            <img 
              src={`http://localhost:8080${category.imageUrl}`}
              alt={category.name}
              className="category-image"
            />
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

/*import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        // Manteniendo tu formato original de imageUrl
        const formattedCategories = response.data.map(category => ({
          name: category.name,
          imageUrl: category.imageUrl 
        }));
        
        setCategories(formattedCategories);
        console.log(formattedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar las categorías');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    
    <section className="categories-section">
      <h2>Buscar por tipo de alojamiento</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card"> 
            <img 
              src={`http://localhost:8080${category.imageUrl}`} 
              alt={category.name}
              className="category-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-category-icon.png';
              }}
            />
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
*/