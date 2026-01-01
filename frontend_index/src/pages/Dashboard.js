import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import HommeService from '../services/hommeService';
import FemmeService from '../services/femmeService';
import AIProductModal from '../components/AIProductModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    hommeProducts: 0,
    hommeUsers: 0,
    femmeProducts: 0,
    femmeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setLoading(false); // Show UI immediately
    
    // Load each stat completely independently - no waiting for others
    // Each request updates the UI as soon as it completes
    HommeService.getAllProduits()
      .then(res => setStats(prev => ({ ...prev, hommeProducts: res.data?.length || 0 })))
      .catch(err => console.warn('Service homme produits unavailable:', err.message));
    
    HommeService.getAllUsers()
      .then(res => setStats(prev => ({ ...prev, hommeUsers: res.data?.length || 0 })))
      .catch(err => console.warn('Service homme users unavailable:', err.message));
    
    FemmeService.getAllProduits()
      .then(res => setStats(prev => ({ ...prev, femmeProducts: res.data?.length || 0 })))
      .catch(err => console.warn('Service femme produits unavailable:', err.message));
    
    FemmeService.getAllUsers()
      .then(res => setStats(prev => ({ ...prev, femmeUsers: res.data?.length || 0 })))
      .catch(err => console.warn('Service femme users unavailable:', err.message));
  };

  const handleProductCreated = () => {
    loadStats(); // Refresh stats after AI product creation
  };

  // Redirect non-admin users to client dashboard
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #232f3e 0%, #0a1d2e 100%)', color: 'white', padding: '2rem 0' }}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 style={{ fontSize: '2.5rem', fontWeight: '300', margin: 0, letterSpacing: '-0.5px' }}>
                <i className="fas fa-chart-line me-3"></i>
                Tableau de Bord
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '1rem' }}>
                Bienvenue, <strong>{user?.username}</strong>
              </p>
            </div>
            <div className="col-md-6 text-end">
              <button 
                className="btn btn-lg text-white fw-bold shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #FF9900 0%, #FF6B6B 100%)',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowAIModal(true)}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <i className="fas fa-magic me-2"></i>
                Ajouter Produit IA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid" style={{ padding: '2rem 1rem' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ borderLeft: '4px solid #FF9900', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>PRODUITS HOMME</p>
                        <h2 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#232f3e' }}>
                          {stats.hommeProducts}
                        </h2>
                      </div>
                      <i className="fas fa-male" style={{ fontSize: '2.5rem', color: '#0066cc', opacity: 0.2 }}></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ borderLeft: '4px solid #00a8e8', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>UTILISATEURS HOMME</p>
                        <h2 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#232f3e' }}>
                          {stats.hommeUsers}
                        </h2>
                      </div>
                      <i className="fas fa-users" style={{ fontSize: '2.5rem', color: '#00a8e8', opacity: 0.2 }}></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ borderLeft: '4px solid #d1426e', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>PRODUITS FEMME</p>
                        <h2 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#232f3e' }}>
                          {stats.femmeProducts}
                        </h2>
                      </div>
                      <i className="fas fa-female" style={{ fontSize: '2.5rem', color: '#d1426e', opacity: 0.2 }}></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ borderLeft: '4px solid #f72585', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>UTILISATEURS FEMME</p>
                        <h2 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#232f3e' }}>
                          {stats.femmeUsers}
                        </h2>
                      </div>
                      <i className="fas fa-users" style={{ fontSize: '2.5rem', color: '#f72585', opacity: 0.2 }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="row g-3">
              {/* Section Homme */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  <div 
                    className="card-header"
                    style={{ 
                      background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                      color: 'white',
                      padding: '1.5rem',
                      borderBottom: 'none'
                    }}
                  >
                    <h5 className="mb-0" style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                      <i className="fas fa-male me-2"></i>
                      Section Homme
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-3">Gestion des produits et utilisateurs de la section Homme</p>
                    <div className="d-flex gap-2">
                      <Link 
                        to="/produits/homme" 
                        className="btn flex-grow-1 fw-bold"
                        style={{ background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0052a3'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#0066cc'}
                      >
                        <i className="fas fa-box me-2"></i>
                        Produits ({stats.hommeProducts})
                      </Link>
                      <Link 
                        to="/users/homme" 
                        className="btn flex-grow-1 fw-bold"
                        style={{ background: '#005fb3', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0052a3'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#005fb3'}
                      >
                        <i className="fas fa-users me-2"></i>
                        Utilisateurs ({stats.hommeUsers})
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Femme */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  <div 
                    className="card-header"
                    style={{ 
                      background: 'linear-gradient(135deg, #d1426e 0%, #b30950 100%)',
                      color: 'white',
                      padding: '1.5rem',
                      borderBottom: 'none'
                    }}
                  >
                    <h5 className="mb-0" style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                      <i className="fas fa-female me-2"></i>
                      Section Femme
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-3">Gestion des produits et utilisateurs de la section Femme</p>
                    <div className="d-flex gap-2">
                      <Link 
                        to="/produits/femme" 
                        className="btn flex-grow-1 fw-bold"
                        style={{ background: '#d1426e', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#b30950'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#d1426e'}
                      >
                        <i className="fas fa-box me-2"></i>
                        Produits ({stats.femmeProducts})
                      </Link>
                      <Link 
                        to="/users/femme" 
                        className="btn flex-grow-1 fw-bold"
                        style={{ background: '#b30950', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#8f073f'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#b30950'}
                      >
                        <i className="fas fa-users me-2"></i>
                        Utilisateurs ({stats.femmeUsers})
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* AI Product Modal */}
      <AIProductModal
        show={showAIModal}
        onClose={() => setShowAIModal(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
};

export default Dashboard;
