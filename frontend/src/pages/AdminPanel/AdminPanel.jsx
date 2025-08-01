import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
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
        <Link to="/admin" className="admin-link active">Productos</Link>
        <Link to="/admin/features" className="admin-link">Caracteristicas</Link>
        <Link to="/admin/categories" className="admin-link">Categorias</Link>
        <Link to="/admin/users" className="admin-link">Usuarios</Link>
      </nav>

      <Link to="/admin/add-product" className="admin-link">+ Producto</Link>
      <br></br>
      <br></br>
      
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>
                   <button 
                    onClick={() => navigate(`/admin/edit-product/products/${product.id}`)}
                    className="delete-btn"
                  >
                    Modificar
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
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

export default AdminPanel;