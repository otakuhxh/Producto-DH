import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error al cargar el producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const openFullGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setShowFullGallery(true);
    document.body.style.overflow = 'hidden'; // Bloquear scroll al abrir el modal
  };

  const closeFullGallery = () => {
    setShowFullGallery(false);
    document.body.style.overflow = 'auto'; // Restaurar scroll al cerrar
  };

  const navigateImages = (direction) => {
    setCurrentImageIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? product.imageUrls.length - 1 : prev - 1;
      } else {
        return prev === product.imageUrls.length - 1 ? 0 : prev + 1;
      }
    });
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Producto no encontrado</div>;

  const mainImage = product.imageUrls?.[0];
  const secondaryImages = product.imageUrls?.slice(1, 5) || [];
  const hasMoreImages = product.imageUrls?.length > 5;

  return (
    <div className="product-detail-container">
      {/* Header */}
      <header className="product-detail-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Volver al Home
        </button>
        <h1 className="product-title">{product.name}</h1>
      </header>

      {/* Body */}
      <div className="product-detail-body">
        {/* Galería de imágenes - Versión mejorada */}
        <div className="image-gallery-section">
          <div className="gallery-grid">
            {/* Imagen principal más ancha */}
            <div className="main-image-container">
              {mainImage && (
                <img 
                  src={`http://localhost:8080${mainImage}`}
                  alt={`${product.name} principal`}
                  className="main-image"
                  onClick={() => openFullGallery(0)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                  }}
                />
              )}
            </div>
            
            {/* Grid 2x2 más ancho */}
            <div className="secondary-images-grid">
              {secondaryImages.map((imgUrl, index) => (
                <div 
                  key={`secondary-${index}`}
                  className="secondary-image-container"
                  onClick={() => openFullGallery(index + 1)}
                >
                  <img 
                    src={`http://localhost:8080${imgUrl}`}
                    alt={`${product.name} ${index + 2}`}
                    className="secondary-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Botón "Ver todas las imágenes" */}
          {hasMoreImages && (
            <div className="view-more-container">
              <button 
                className="view-more-button"
                onClick={() => openFullGallery()}
              >
                Ver todas las imágenes ({product.imageUrls.length})
              </button>
            </div>
          )}
        </div>

        {/* Descripción del producto */}
        <div className="product-info-section">
          <div className="product-description">
            <h2>Descripción</h2>
            <p>{product.description || "No hay descripción disponible"}</p>
          </div>
          
          <div className="product-meta">
            <span className="location">📍 {product.city || "Ubicación no especificada"}</span>
            <div className="rating">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 0) ? 'star filled' : 'star'}>
                  {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Galería completa (modal mejorado) */}
      {showFullGallery && (
        <div className="full-gallery-modal" onClick={closeFullGallery}>
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-header">
              <button className="close-button" onClick={closeFullGallery}>
                × Cerrar
              </button>
              <div className="gallery-counter">
                Imagen {currentImageIndex + 1} de {product.imageUrls.length}
              </div>
            </div>
            
            <div className="gallery-main-image">
              <button 
                className="nav-button prev"
                onClick={() => navigateImages('prev')}
              >
                ‹
              </button>
              
              <img 
                src={`http://localhost:8080${product.imageUrls[currentImageIndex]}`}
                alt={`${product.name} ${currentImageIndex + 1}`}
                className="current-large-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                }}
              />
              
              <button 
                className="nav-button next"
                onClick={() => navigateImages('next')}
              >
                ›
              </button>
            </div>
            
            <div className="gallery-thumbnails">
              {product.imageUrls.map((imgUrl, index) => (
                <div 
                  key={`gallery-thumb-${index}`}
                  className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={`http://localhost:8080${imgUrl}`}
                    alt={`Miniatura ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100x75?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

/*
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="product-detail-container">
      {// Header (100% ancho) }
      <header className="product-detail-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
        <h1 className="product-title">{product.name}</h1>
      </header>

      {// Body }
      <div className="product-detail-body">
        {// Galería de imágenes }
        <div className="product-gallery">
          {product.imageUrls?.map((imgUrl, index) => (
            <img 
              key={index}
              src={`http://localhost:8080${imgUrl}`}
              alt={`${product.name} ${index + 1}`}
              className="product-image"
            />
          ))}
        </div>

        {// Descripción }
        <div className="product-description">
          <h2>Descripción</h2>
          <p>{product.description}</p>
          
          {// Detalles adicionales }
          <div className="product-meta">
            <span className="location">📍 {product.city}</span>
            <div className="rating">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;*/