import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchSection from '../../components/SearchSection/SearchSection';
import api from '../../services/api';
import CategoriesSection from '../../components/CategoriesSection/CategoriesSection';
import './Home.css';

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    checkIn: '',
    checkOut: '',
    category: ''
  });

  // Cargar productos iniciales
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Aplicar filtros cuando cambian los parámetros
  useEffect(() => {
    const applyFilters = () => {
      let results = [...products];

      // Filtrar por término de búsqueda (nombre o ciudad)
      if (searchParams.searchTerm) {
        const term = searchParams.searchTerm.toLowerCase();
        results = results.filter(product => 
          product.name.toLowerCase().includes(term) || 
          product.city.toLowerCase().includes(term)
        );
      }

      // Filtrar por categoría
      if (searchParams.category) {
        results = results.filter(product => 
          product.category === searchParams.category
        );
      }

      // Filtrar por disponibilidad de fechas
      if (searchParams.checkIn && searchParams.checkOut) {
        results = results.filter(product => {
          return !product.unavailableDates?.some(date => {
            const unavailableDate = new Date(date);
            return unavailableDate >= new Date(searchParams.checkIn) && 
                   unavailableDate <= new Date(searchParams.checkOut);
          });
        });
      }

      setFilteredProducts(results);
      setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
      setCurrentPage(1);
    };

    applyFilters();
  }, [searchParams, products]);

  // Manejar búsqueda desde el SearchSection
  const handleSearch = ({ location, checkIn, checkOut }) => {
    setSearchParams(prev => ({ 
      ...prev, 
      searchTerm: location || '',
      checkIn: checkIn || '',
      checkOut: checkOut || ''
    }));
  };

  // Manejar clic en categoría
  const handleCategoryClick = (category) => {
    setSearchParams(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  // Quitar todos los filtros
  const clearFilters = () => {
    setSearchParams({
      searchTerm: '',
      checkIn: '',
      checkOut: '',
      category: ''
    });
  };

  // Obtener productos para la página actual
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Cambiar página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegación entre páginas
  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(totalPages);
  const goToPrevPage = () => handlePageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => handlePageChange(Math.min(totalPages, currentPage + 1));

  if (isLoading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="home">
      <SearchSection onSearch={handleSearch} />
      
      <CategoriesSection 
        onCategoryClick={handleCategoryClick} 
        selectedCategory={searchParams.category}
      />
      
      <section className="recommendations">
        <div className="results-header">
           {(searchParams.searchTerm || searchParams.checkIn || searchParams.category) && (
            <button 
              onClick={clearFilters}
              className="clear-filters-button"
            >
              Quitar filtros
            </button>
          )}
          <h2>
            {searchParams.searchTerm || searchParams.checkIn || searchParams.category 
              ? `Resultados (${filteredProducts.length})` 
              : 'Todos nuestros productos'}
          </h2>
        
        </div>
        
        <div className="product-grid">
          {getCurrentProducts().map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            No se encontraron productos con los criterios de búsqueda
            {/*<button onClick={clearFilters}className="clear-filters-button">Mostrar todos los productos</button>*/}
          </div>
        )}

        {filteredProducts.length > 0 && (
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
        )}
      </section>
    </div>
  );
};

export default Home;

/*
import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchSection from '../../components/SearchSection/SearchSection';
import api from '../../services/api';
import CategoriesSection from '../../components/CategoriesSection/CategoriesSection';
import './Home.css';

const ITEMS_PER_PAGE = 10;
const INITIAL_FETCH_COUNT = 3; 

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

        // Controles de paginación 
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
*/