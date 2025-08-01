import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import AddProduct from './pages/AddProduct/AddProduct';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Header from './components/Header/Header';
import './App.css';
import EditProduct from './pages/EditProduct/EditProduct';
import Register from './pages/Register/Register';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import UserManagement from './pages/Users/UserManagement';
import AdminRoute from './pages/Users/AdminRoute';
import AddCategory from './pages/Category/AddCategory';
import EditCategory from './pages/Category/EditCategory';
import AdminCategories from './pages/Category/AdminCategories';
import AdminFeatures from './pages/Features/AdminFeatures';
import AddFeature from './pages/Features/AddFeature';
import EditFeature from './pages/Features/EditFeature';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Rutas protegidas para administradores */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/products/:id" element={<EditProduct />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/edit-category/:id" element={<EditCategory />} />
            <Route path="/admin/features" element={<AdminFeatures />} />
            <Route path="/admin/add-feature" element={<AddFeature />} />
            <Route path="/admin/edit-feature/:id" element={<EditFeature />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;