import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AdminPanel/AdminPanel.css';

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({}); // Para almacenar productos por categoría
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
        
        // Obtener productos para contar por categoría
        const productsResponse = await api.get('/products');
        const counts = {};
        
        productsResponse.data.forEach(product => {
          counts[product.category] = (counts[product.category] || 0) + 1;
        });
        
        setProductsByCategory(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleDelete = async (category) => {
    // Obtener el número de productos asociados a esta categoría
    const productCount = productsByCategory[category.name] || 0;
    
    // Crear mensaje de confirmación detallado
    const confirmationMessage = `
      ¿Estás seguro de que deseas eliminar la categoría "${category.name}"?
      
      ADVERTENCIA: 
      Esta acción eliminará permanentemente la categoría y los productos asociaciados
      ${productCount > 0 ? 

        `Hay ${productCount} producto(s) asociado(s) a esta categoría.` : 
        'No hay productos asociados a esta categoría.'
      }
      
      ¿Deseas continuar con la eliminación?
    `;
    
    // Mostrar confirmación
    if (window.confirm(confirmationMessage)) {
      try {
        // Primero eliminar los productos asociados (si los hay)
        /*
        if (productCount > 0) {
          await api.delete(`/products/by-category/${category.name}`);
        }*/
             if (productCount > 0) {
        // Obtener todos los productos de esta categoría
        const productsResponse = await api.get('/products');
        const productsToDelete = productsResponse.data
          .filter(p => p.category === category.name)
          .map(p => p.id);
        
        // Eliminar cada producto individualmente
        for (const productId of productsToDelete) {
          await api.delete(`/products/${productId}`);
        }
      }
        
        // Luego eliminar la categoría
        await api.delete(`/categories/${category.id}`);
        
        // Actualizar el estado
        setCategories(categories.filter(c => c.id !== category.id));
        
        // Mostrar mensaje de éxito
        alert(`Categoría "${category.name}" eliminada exitosamente. 
               ${productCount > 0 ? `${productCount} producto(s) asociado(s) también fueron eliminados.` : ''}`);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(`Error al eliminar la categoría: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h2>Panel de administración no disponible en dispositivos móviles</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <h1>Panel de Administración</h1>
        <div className="loading-message">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <nav className="admin-menu">
        <Link to="/admin" className="admin-link">Productos</Link>
        <Link to="/admin/features" className="admin-link">Caracteristicas</Link>
        <Link to="/admin/categories" className="admin-link active">Categorias</Link>
        <Link to="/admin/users" className="admin-link">Usuarios</Link>
      </nav>

      <Link to="/admin/add-category" className="admin-link">+ Categoría</Link>
      <br /><br />
      
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos Asociados</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{productsByCategory[category.name] || 0}</td>
                <td>
                  {category.imageUrl && (
                    <img 
                      src={`http://localhost:8080${category.imageUrl}`} 
                      alt={category.name} 
                      className="category-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
                      }}
                    />
                  )}
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/admin/edit-category/${category.id}`)}
                    className="delete-btn"
                  >
                    Modificar
                  </button>
                  <button 
                    onClick={() => handleDelete(category)} // Pasamos el objeto completo de categoría
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;

/*import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../AdminPanel/AdminPanel.css';

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h2>Panel de administración no disponible en dispositivos móviles</h2>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <nav className="admin-menu">
        <Link to="/admin" className="admin-link">Productos</Link>
        <Link to="/admin" className="admin-link">Caracteristicas</Link>
        <Link to="/admin/categories" className="admin-link active">Categorias</Link>
        <Link to="/admin/users" className="admin-link">Usuarios</Link>
      </nav>

      <Link to="/admin/add-category" className="admin-link">+ Categoría</Link>
      <br /><br />
      
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  {category.imageUrl && (
                    <img 
                        src={`http://localhost:8080${category.imageUrl}`} 
                      alt={category.name} 
                      className="category-thumbnail"
                    />
                  )}
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/admin/edit-category/${category.id}`)}
                    className="delete-btn"
                  >
                    Modificar
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;*/