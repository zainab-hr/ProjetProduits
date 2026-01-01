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
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setLoading(false);
    
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
    loadStats();
  };

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/shop" replace />;
  }

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #d4a574 0%, #c9a88e 50%, #e8d5c4 100%)',
      minHeight: '100vh',
    },
    header: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1.5rem 0',
    },
    headerTitle: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #f5e6d3 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: '0.5rem 0 0 0',
      fontSize: '1rem',
    },
    statsCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      border: '1px solid rgba(166, 124, 82, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      height: '100%',
    },
    statsIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#fff',
    },
    statsNumber: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#2d3436',
      lineHeight: 1,
    },
    statsLabel: {
      color: '#636e72',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginTop: '0.25rem',
    },
    sectionCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      border: '1px solid rgba(166, 124, 82, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    sectionHeader: {
      padding: '1.5rem',
      color: '#fff',
    },
    actionButton: {
      borderRadius: '50px',
      padding: '0.8rem 1.5rem',
      fontWeight: '600',
      border: 'none',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      flex: 1,
    },
    quickActionCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      padding: '2rem',
      textAlign: 'center',
      border: '1px solid rgba(166, 124, 82, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    aiButton: {
      background: 'linear-gradient(135deg, #a67c52 0%, #8b6914 100%)',
      border: 'none',
      borderRadius: '50px',
      padding: '1rem 2rem',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#fff',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 40px rgba(166, 124, 82, 0.4)',
    },
  };

  const totalProducts = stats.hommeProducts + stats.femmeProducts;
  const totalUsers = stats.hommeUsers + stats.femmeUsers;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div className="container-fluid px-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 style={styles.headerTitle}>
                <i className="fas fa-crown me-3"></i>
                Tableau de Bord Admin
              </h1>
              <p style={styles.headerSubtitle}>
                Bienvenue, <strong>{user?.username}</strong> • Gérez votre boutique en toute simplicité
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <button 
                style={styles.aiButton}
                onClick={() => setShowAIModal(true)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 50px rgba(166, 124, 82, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 40px rgba(166, 124, 82, 0.4)';
                }}
              >
                <i className="fas fa-magic me-2"></i>
                Créer avec IA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid px-4 py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#a67c52' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="row g-4 mb-4">
              {/* Total Stats Card */}
              <div className="col-12 col-lg-4">
                <div 
                  style={{...styles.statsCard, background: 'linear-gradient(135deg, #a67c52 0%, #c9a88e 100%)', color: '#fff'}}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p style={{ opacity: 0.9, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Produits</p>
                      <h2 style={{ ...styles.statsNumber, color: '#fff' }}>{totalProducts}</h2>
                    </div>
                    <div style={{...styles.statsIcon, background: 'rgba(255,255,255,0.2)'}}>
                      <i className="fas fa-boxes"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <small><i className="fas fa-arrow-up me-1"></i> Actifs dans la boutique</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div 
                  style={{...styles.statsCard, background: 'linear-gradient(135deg, #d4a574 0%, #e8d5c4 100%)'}}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p style={{ color: '#6b5b4f', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Utilisateurs</p>
                      <h2 style={styles.statsNumber}>{totalUsers}</h2>
                    </div>
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #a67c52 0%, #8b6914 100%)'}}>
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(166,124,82,0.2)' }}>
                    <small style={{ color: '#6b5b4f' }}><i className="fas fa-user-check me-1"></i> Comptes actifs</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div 
                  style={styles.statsCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p style={{ color: '#6b5b4f', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Catégories</p>
                      <h2 style={styles.statsNumber}>2</h2>
                    </div>
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #c9a88e 0%, #d4a574 100%)'}}>
                      <i className="fas fa-tags"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(166,124,82,0.2)' }}>
                    <small style={{ color: '#6b5b4f' }}><i className="fas fa-venus-mars me-1"></i> Homme & Femme</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="row g-4 mb-4">
              <div className="col-6 col-lg-3">
                <div 
                  style={styles.statsCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)'}}>
                      <i className="fas fa-tshirt"></i>
                    </div>
                    <div>
                      <h3 style={{...styles.statsNumber, fontSize: '2rem'}}>{stats.hommeProducts}</h3>
                      <p style={styles.statsLabel}>Produits Homme</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div 
                  style={styles.statsCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #00a8e8 0%, #0077b6 100%)'}}>
                      <i className="fas fa-male"></i>
                    </div>
                    <div>
                      <h3 style={{...styles.statsNumber, fontSize: '2rem'}}>{stats.hommeUsers}</h3>
                      <p style={styles.statsLabel}>Utilisateurs Homme</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div 
                  style={styles.statsCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #d63384 0%, #b02a6f 100%)'}}>
                      <i className="fas fa-gem"></i>
                    </div>
                    <div>
                      <h3 style={{...styles.statsNumber, fontSize: '2rem'}}>{stats.femmeProducts}</h3>
                      <p style={styles.statsLabel}>Produits Femme</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div 
                  style={styles.statsCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #f72585 0%, #b5179e 100%)'}}>
                      <i className="fas fa-female"></i>
                    </div>
                    <div>
                      <h3 style={{...styles.statsNumber, fontSize: '2rem'}}>{stats.femmeUsers}</h3>
                      <p style={styles.statsLabel}>Utilisateurs Femme</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Sections */}
            <div className="row g-4 mb-4">
              {/* Section Homme */}
              <div className="col-lg-6">
                <div 
                  style={styles.sectionCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{...styles.sectionHeader, background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)'}}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{...styles.statsIcon, background: 'rgba(255,255,255,0.2)', width: '50px', height: '50px', fontSize: '1.25rem'}}>
                        <i className="fas fa-male"></i>
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Section Homme</h5>
                        <small style={{ opacity: 0.8 }}>Gérer les produits et utilisateurs</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(0, 102, 204, 0.1)', borderRadius: '1rem' }}>
                          <h4 className="mb-0" style={{ color: '#0066cc' }}>{stats.hommeProducts}</h4>
                          <small className="text-muted">Produits</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(0, 168, 232, 0.1)', borderRadius: '1rem' }}>
                          <h4 className="mb-0" style={{ color: '#00a8e8' }}>{stats.hommeUsers}</h4>
                          <small className="text-muted">Utilisateurs</small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <Link 
                        to="/produits/homme" 
                        style={{...styles.actionButton, background: '#0066cc', color: '#fff'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0052a3'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#0066cc'}
                      >
                        <i className="fas fa-box"></i>
                        Produits
                      </Link>
                      <Link 
                        to="/users/homme" 
                        style={{...styles.actionButton, background: '#00a8e8', color: '#fff'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0077b6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#00a8e8'}
                      >
                        <i className="fas fa-users"></i>
                        Utilisateurs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Femme */}
              <div className="col-lg-6">
                <div 
                  style={styles.sectionCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{...styles.sectionHeader, background: 'linear-gradient(135deg, #d63384 0%, #b02a6f 100%)'}}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{...styles.statsIcon, background: 'rgba(255,255,255,0.2)', width: '50px', height: '50px', fontSize: '1.25rem'}}>
                        <i className="fas fa-female"></i>
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Section Femme</h5>
                        <small style={{ opacity: 0.8 }}>Gérer les produits et utilisateurs</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(214, 51, 132, 0.1)', borderRadius: '1rem' }}>
                          <h4 className="mb-0" style={{ color: '#d63384' }}>{stats.femmeProducts}</h4>
                          <small className="text-muted">Produits</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(247, 37, 133, 0.1)', borderRadius: '1rem' }}>
                          <h4 className="mb-0" style={{ color: '#f72585' }}>{stats.femmeUsers}</h4>
                          <small className="text-muted">Utilisateurs</small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <Link 
                        to="/produits/femme" 
                        style={{...styles.actionButton, background: '#d63384', color: '#fff'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#b02a6f'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#d63384'}
                      >
                        <i className="fas fa-box"></i>
                        Produits
                      </Link>
                      <Link 
                        to="/users/femme" 
                        style={{...styles.actionButton, background: '#f72585', color: '#fff'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#b5179e'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#f72585'}
                      >
                        <i className="fas fa-users"></i>
                        Utilisateurs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-4">
              <div className="col-12">
                <h5 style={{ color: '#fff', marginBottom: '1rem', fontWeight: '600' }}>
                  <i className="fas fa-bolt me-2"></i>
                  Actions Rapides
                </h5>
              </div>
              <div className="col-6 col-md-3">
                <div 
                  style={styles.quickActionCard}
                  onClick={() => setShowAIModal(true)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #a67c52 0%, #8b6914 100%)', margin: '0 auto 1rem'}}>
                    <i className="fas fa-magic"></i>
                  </div>
                  <h6 className="mb-1" style={{ color: '#2d3436' }}>Créer avec IA</h6>
                  <small className="text-muted">Générer un produit</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/produits/homme" style={{ textDecoration: 'none' }}>
                  <div 
                    style={styles.quickActionCard}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)', margin: '0 auto 1rem'}}>
                      <i className="fas fa-plus"></i>
                    </div>
                    <h6 className="mb-1" style={{ color: '#2d3436' }}>Ajouter Produit</h6>
                    <small className="text-muted">Nouveau produit homme</small>
                  </div>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/produits/femme" style={{ textDecoration: 'none' }}>
                  <div 
                    style={styles.quickActionCard}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #d63384 0%, #b02a6f 100%)', margin: '0 auto 1rem'}}>
                      <i className="fas fa-plus"></i>
                    </div>
                    <h6 className="mb-1" style={{ color: '#2d3436' }}>Ajouter Produit</h6>
                    <small className="text-muted">Nouveau produit femme</small>
                  </div>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/users/homme" style={{ textDecoration: 'none' }}>
                  <div 
                    style={styles.quickActionCard}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{...styles.statsIcon, background: 'linear-gradient(135deg, #00a8e8 0%, #0077b6 100%)', margin: '0 auto 1rem'}}>
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <h6 className="mb-1" style={{ color: '#2d3436' }}>Gérer Utilisateurs</h6>
                    <small className="text-muted">Voir tous les comptes</small>
                  </div>
                </Link>
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
