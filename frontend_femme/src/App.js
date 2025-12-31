import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProduitsHomme from './pages/ProduitsHomme';
import ProduitsFemme from './pages/ProduitsFemme';
import UsersHomme from './pages/UsersHomme';
import UsersFemme from './pages/UsersFemme';



function AppContent() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop/:id" element={<ClientDashboard />} />
        <Route path="/produits/homme" element={<ProduitsHomme />} />
        <Route path="/produits/femme" element={<ProduitsFemme />} />
        <Route path="/users/homme" element={<UsersHomme />} />
        <Route path="/users/femme" element={<UsersFemme />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
