import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import AddProduct from './pages/AddProduct/AddProduct';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Header from './components/Header/Header';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;