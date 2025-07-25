import React from 'react';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const categories = [
    { name: 'Hoteles', count: '807,105', icon: '🏨' },
    { name: 'Departamentos', count: '356,221', icon: '🏢' },
    { name: 'Bed and breakfast', count: '89,764', icon: '🍳' }
  ];

  return (
    <section className="categories-section">
      <h2>Buscar por tipo de alojamiento</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <span className="category-icon">{category.icon}</span>
            <div>
              <h3>{category.name}</h3>
              <p>{category.count} {category.name.toLowerCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;