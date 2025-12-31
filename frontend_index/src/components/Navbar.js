import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount, openCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';
  const cartCount = getCartCount();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Client navbar (non-admin users)
  if (!isAdmin) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
        background: user?.genre === 'HOMME' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/shop">
            <i className={`fas fa-${user?.genre === 'HOMME' ? 'tshirt' : 'gem'} me-2`}></i>
            {user?.genre === 'HOMME' ? 'Mode Homme' : 'Mode Femme'}
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/shop')}`} to="/shop">
                  <i className="fas fa-shopping-bag me-1"></i> Boutique
                </Link>
              </li>
            </ul>
            
            <ul className="navbar-nav">
              {/* Cart Button */}
              <li className="nav-item me-3">
                <button 
                  className="btn btn-link nav-link position-relative"
                  onClick={openCart}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="fas fa-shopping-cart fa-lg"></i>
                  {cartCount > 0 && (
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              </li>
              
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user?.username}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text text-muted">
                      <small>{user?.email}</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // Admin navbar
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <i className="fas fa-shopping-bag me-2"></i>
          Projet Produits
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i> Dashboard
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-mars me-1"></i> Homme
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/produits/homme">
                    <i className="fas fa-box me-2"></i> Produits
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/users/homme">
                    <i className="fas fa-users me-2"></i> Utilisateurs
                  </Link>
                </li>
              </ul>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-venus me-1"></i> Femme
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/produits/femme">
                    <i className="fas fa-box me-2"></i> Produits
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/users/femme">
                    <i className="fas fa-users me-2"></i> Utilisateurs
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-user-circle me-1"></i>
                {user?.username}
                <span className={`badge ms-2 ${user?.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                  {user?.role}
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
