import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
          {i < Math.floor(product.rating) ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image">
          <img src={`http://localhost:8080${product.imageUrls[0]}`}
 alt={product.name} />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="rating">{renderStars()}</div>
          <p className="location">{product.city}</p>
          <button className="show-map">MOSTRAR MÁS DETALLES</button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
/*
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
          {i < Math.floor(product.rating) ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  // Obtener la primera imagen (ya sea de imageUrl o imageUrls)
  const getFirstImage = () => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return 'https://via.placeholder.com/300';
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="product-image">
          <img 
            src={getFirstImage()} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
            }}
          />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="rating">{renderStars()}</div>
          <p className="location">{product.city}</p>
          <button 
            className="show-map"
            onClick={(e) => e.preventDefault()} // Evita que el Link se active al hacer clic
          >
            MOSTRAR MÁS DETALLES
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

*/