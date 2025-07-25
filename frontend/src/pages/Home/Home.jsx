import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchSection from '../../components/SearchSection/SearchSection';
import api from '../../services/api';
import CategoriesSection from '../../components/CategoriesSection/CategoriesSection';
import './Home.css';

const ITEMS_PER_PAGE = 10;
const INITIAL_FETCH_COUNT = 3; // Número de llamadas iniciales para obtener productos

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Realizar múltiples llamadas para obtener suficientes productos
        const responses = await Promise.all(
          Array.from({ length: INITIAL_FETCH_COUNT }).map(() => 
            api.get('/products/random')
          )
        );
        
        // Combinar y eliminar duplicados
        const combinedProducts = responses.flatMap(response => response.data);
        const uniqueProducts = combinedProducts.filter(
          (product, index, self) => index === self.findIndex(p => p.id === product.id)
        );
        
        setAllProducts(uniqueProducts);
        setTotalPages(Math.ceil(uniqueProducts.length / ITEMS_PER_PAGE));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Obtener productos para la página actual
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allProducts.slice(startIndex, endIndex);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegación
  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(totalPages);
  const goToPrevPage = () => handlePageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => handlePageChange(Math.min(totalPages, currentPage + 1));

  if (isLoading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="home">
      <SearchSection />
      <CategoriesSection />
      
      <section className="recommendations">
        <h2>Productos Recomendados</h2>
        
        <div className="product-grid">
          {getCurrentProducts().map(product => (
            <ProductCard key={`${product.id}-${currentPage}`} product={product} />
          ))}
        </div>

        {/* Controles de paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="pagination-buttons">
            <button 
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &laquo;
            </button>
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &lsaquo;
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &rsaquo;
            </button>
            <button 
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &raquo;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;