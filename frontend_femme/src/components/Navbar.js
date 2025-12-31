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
   localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Redirect to port 3000 (index frontend)
    window.location.href = 'http://localhost:3000';
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Client navbar (non-admin users)
  if (!isAdmin) {
    return (
      <nav className="navbar-custom">
        <div className="navbar-container">
          <Link className="navbar-brand-custom" to="/shop/:id">
            {user?.genre === 'HOMME' ? 'Mode Homme' : 'Mode Femme'}
          </Link>
          <div className="navbar-links">
            <Link className={`nav-link-custom ${isActive('/shop/:id')}`} to="/shop/:id">
              Boutique
            </Link>
          </div>
          <div className="navbar-actions">
            <button className="cart-btn-custom" onClick={openCart}>
              Panier
              {cartCount > 0 && (
                <span className="cart-badge-custom">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <span className="navbar-username">{user?.username}</span>
            <button className="logout-btn-custom" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
        <style jsx="true">{`
          .navbar-custom {
            width: 100%;
            background: #fff;
            box-shadow: 0 2px 16px rgba(0,0,0,0.08);
            padding: 0.7rem 0;
            border-radius: 0 0 18px 18px;
            margin-bottom: 18px;
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .navbar-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
          }
          .navbar-brand-custom {
            font-size: 1.5rem;
            font-weight: 800;
            color: #a832a6;
            letter-spacing: 1px;
            text-decoration: none;
          }
          .navbar-links {
            display: flex;
            gap: 1.5rem;
          }
          .nav-link-custom {
            color: #a832a6;
            font-size: 1.08rem;
            font-weight: 500;
            text-decoration: none;
            padding: 0.3rem 1rem;
            border-radius: 8px;
            transition: background 0.2s;
          }
          .nav-link-custom.active, .nav-link-custom:hover {
            background: #f3e8ff;
            color: #a832a6;
          }
          .navbar-actions {
            display: flex;
            align-items: center;
            gap: 1.2rem;
          }
          .cart-btn-custom {
            color: #a832a6;
            background: #f3e8ff;
            border: none;
            border-radius: 18px;
            padding: 0.4rem 1.2rem;
            font-weight: 700;
            font-size: 1.05rem;
            position: relative;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            transition: background 0.2s, color 0.2s;
          }
          .cart-btn-custom:hover {
            background: #a832a6;
            color: #fff;
          }
          .cart-badge-custom {
            background: #e11d48;
            color: #fff;
            border-radius: 12px;
            font-size: 0.8rem;
            padding: 2px 7px;
            position: absolute;
            top: -8px;
            right: -18px;
          }
          .user-btn-custom {
            background: #f3e8ff;
            color: #a832a6;
            border: none;
            border-radius: 18px;
            padding: 0.4rem 1.2rem;
            font-weight: 700;
            font-size: 1.05rem;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
          }
          .user-btn-custom:hover {
            background: #a832a6;
            color: #fff;
          }
          .navbar-username {
            color: #a832a6;
            font-weight: 600;
            margin-left: 1.2rem;
            margin-right: 0.5rem;
            font-size: 1.05rem;
          }
          .logout-btn-custom {
            background: #fff;
            color: #a832a6;
            border: 1.5px solid #a832a6;
            border-radius: 18px;
            padding: 0.4rem 1.2rem;
            font-weight: 700;
            font-size: 1.05rem;
            cursor: pointer;
            transition: background 0.2s, color 0.2s, border 0.2s;
            margin-left: 0.5rem;
          }
          .logout-btn-custom:hover {
            background: #a832a6;
            color: #fff;
            border: 1.5px solid #a832a6;
          }
        `}</style>
      </nav>
    );
  }

  // Admin navbar épurée sans fond rose ni icônes, bouton déconnexion visible
  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        <Link className="navbar-brand-custom" to="/dashboard">
          Projet Produits
        </Link>
        <div className="navbar-links">
          <Link className={`nav-link-custom ${isActive('/dashboard')}`} to="/dashboard">
            Dashboard
          </Link>
          <div className="dropdown-custom">
            <button className="nav-link-custom">Homme</button>
            <div className="dropdown-content-custom">
              <Link className="dropdown-link-custom" to="/produits/homme">Produits</Link>
              <Link className="dropdown-link-custom" to="/users/homme">Utilisateurs</Link>
            </div>
          </div>
          <div className="dropdown-custom">
            <button className="nav-link-custom">Femme</button>
            <div className="dropdown-content-custom">
              <Link className="dropdown-link-custom" to="/produits/femme">Produits</Link>
              <Link className="dropdown-link-custom" to="/users/femme">Utilisateurs</Link>
            </div>
          </div>
        </div>
        <div className="navbar-actions">
          <span className="navbar-username">{user?.username}<span className="admin-badge-custom">{user?.role}</span></span>
          <button className="logout-btn-custom" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
      <style jsx="true">{`
        .navbar-custom {
          width: 100%;
          background: #fff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          padding: 0.7rem 0;
          border-radius: 0 0 18px 18px;
          margin-bottom: 18px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }
        .navbar-brand-custom {
          font-size: 1.5rem;
          font-weight: 800;
          color: #a832a6;
          letter-spacing: 1px;
          text-decoration: none;
        }
        .navbar-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link-custom {
          color: #a832a6;
          font-size: 1.08rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.3rem 1rem;
          border-radius: 8px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nav-link-custom.active, .nav-link-custom:hover {
          background: #f3e8ff;
          color: #a832a6;
        }
        .dropdown-custom {
          position: relative;
        }
        .dropdown-content-custom {
          display: none;
          position: absolute;
          right: 0;
          background: #fff;
          min-width: 160px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          border-radius: 10px;
          margin-top: 8px;
          z-index: 10;
        }
        .dropdown-custom:hover .dropdown-content-custom,
        .dropdown-custom:focus-within .dropdown-content-custom {
          display: block;
        }
        .dropdown-link-custom {
          display: block;
          padding: 10px 18px;
          color: #a832a6;
          font-size: 0.97rem;
          font-weight: 500;
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .dropdown-link-custom:hover {
          background: #f3e8ff;
          color: #a832a6;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .user-btn-custom {
          background: #f3e8ff;
          color: #a832a6;
          border: none;
          border-radius: 18px;
          padding: 0.4rem 1.2rem;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .user-btn-custom:hover {
          background: #a832a6;
          color: #fff;
        }
        .admin-badge-custom {
          background: #a832a6;
          color: #fff;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 2px 8px;
          margin-left: 10px;
        }
        .dropdown-logout-custom {
          width: 100%;
          background: none;
          border: none;
          color: #a832a6;
          font-size: 1rem;
          padding: 10px 18px;
          text-align: left;
          cursor: pointer;
          border-radius: 0 0 10px 10px;
          transition: background 0.2s, color 0.2s;
        }
        .dropdown-logout-custom:hover {
          background: #f3e8ff;
          color: #a832a6;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
