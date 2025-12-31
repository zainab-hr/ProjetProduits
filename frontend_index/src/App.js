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

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <CartDrawer />}
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/shop" element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        } />
        <Route path="/produits/homme" element={
          <PrivateRoute>
            <ProduitsHomme />
          </PrivateRoute>
        } />
        <Route path="/produits/femme" element={
          <PrivateRoute>
            <ProduitsFemme />
          </PrivateRoute>
        } />
        <Route path="/users/homme" element={
          <PrivateRoute>
            <UsersHomme />
          </PrivateRoute>
        } />
        <Route path="/users/femme" element={
          <PrivateRoute>
            <UsersFemme />
          </PrivateRoute>
        } />
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
