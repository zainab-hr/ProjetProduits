import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080';

// Styles CSS en ligne pour un design e-commerce moderne
const styles = {
  // Animations keyframes
  globalStyles: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `,
  heroSection: {
    background: 'linear-gradient(135deg, #d4a574 0%, #c9a88e 50%, #e8d5c4 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(210, 180, 140, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(188, 143, 143, 0.2) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navBrand: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #f5e6d3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
  },
  navButton: {
    borderRadius: '50px',
    padding: '0.6rem 1.5rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255,255,255,0.3)',
    color: '#fff',
    background: 'transparent',
  },
  navButtonFilled: {
    borderRadius: '50px',
    padding: '0.6rem 1.5rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #c9a88e 0%, #a67c52 100%)',
    border: 'none',
    color: '#fff',
  },
  heroContent: {
    paddingTop: '8rem',
    paddingBottom: '6rem',
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #f5e6d3 50%, #e8d5c4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.7)',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    lineHeight: '1.8',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #a67c52 0%, #8b6914 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 40px rgba(166, 124, 82, 0.4)',
  },
  ctaButtonOutline: {
    background: 'transparent',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50px',
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    transition: 'all 0.3s ease',
  },
  featuresSection: {
    background: '#ffffff',
    padding: '5rem 0',
    marginTop: '-3rem',
    borderRadius: '3rem 3rem 0 0',
    position: 'relative',
    zIndex: 2,
  },
  featureCard: {
    background: 'linear-gradient(135deg, #faf6f2 0%, #ffffff 100%)',
    borderRadius: '1.5rem',
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid rgba(166, 124, 82, 0.1)',
    transition: 'all 0.3s ease',
    height: '100%',
  },
  featureIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '1.8rem',
  },
  productsSection: {
    background: 'linear-gradient(180deg, #ffffff 0%, #faf6f2 100%)',
    padding: '5rem 0',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #5c4033 0%, #a67c52 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  filterButton: {
    borderRadius: '50px',
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: 'none',
    margin: '0.25rem',
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #c9a88e 0%, #a67c52 100%)',
    color: '#fff',
    boxShadow: '0 5px 20px rgba(166, 124, 82, 0.4)',
  },
  filterButtonInactive: {
    background: '#faf6f2',
    color: '#a67c52',
  },
  productCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    border: 'none',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
  },
  productCardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 60px rgba(166, 124, 82, 0.2)',
  },
  productImage: {
    height: '280px',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  productBadge: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  productBadgeHomme: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  productBadgeFemme: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
  },
  wishlistButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  productBody: {
    padding: '1.5rem',
  },
  productTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
    lineHeight: '1.4',
  },
  productCategory: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  productPrice: {
    fontSize: '1.4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a67c52 0%, #8b6914 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  addToCartBtn: {
    background: 'linear-gradient(135deg, #c9a88e 0%, #a67c52 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '0.75rem 1.5rem',
    color: '#fff',
    fontWeight: '600',
    width: '100%',
    marginTop: '1rem',
    transition: 'all 0.3s ease',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modalContent: {
    background: '#ffffff',
    borderRadius: '2rem',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
  },
  modalImage: {
    height: '100%',
    minHeight: '400px',
    objectFit: 'cover',
    borderRadius: '2rem 0 0 2rem',
  },
  footer: {
    background: 'linear-gradient(135deg, #5c4033 0%, #3d2817 100%)',
    padding: '4rem 0 2rem',
    color: '#fff',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    display: 'block',
    marginBottom: '0.5rem',
  },
  newsletter: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '3rem',
  },
  newsletterInput: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50px',
    padding: '1rem 1.5rem',
    color: '#fff',
    width: '100%',
  },
};

const HomePage = () => {
  const [produitsHomme, setProduitsHomme] = useState([]);
  const [produitsFemme, setProduitsFemme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [hommeRes, femmeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/homme/produits`),
        fetch(`${API_BASE_URL}/api/femme/produits`)
      ]);

      if (hommeRes.ok) {
        const hommeData = await hommeRes.json();
        const hommeProducts = Array.isArray(hommeData) ? hommeData : (hommeData.data || []);
        setProduitsHomme(hommeProducts);
      }
      if (femmeRes.ok) {
        const femmeData = await femmeRes.json();
        const femmeProducts = Array.isArray(femmeData) ? femmeData : (femmeData.data || []);
        setProduitsFemme(femmeProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayedProducts = () => {
    switch (activeTab) {
      case 'homme':
        return produitsHomme.map(p => ({ ...p, gender: 'Homme' }));
      case 'femme':
        return produitsFemme.map(p => ({ ...p, gender: 'Femme' }));
      default:
        const maxCount = Math.max(produitsHomme.length, produitsFemme.length);
        const mixed = [];
        for (let i = 0; i < maxCount; i++) {
          if (i < produitsHomme.length) {
            mixed.push({ ...produitsHomme[i], gender: 'Homme' });
          }
          if (i < produitsFemme.length) {
            mixed.push({ ...produitsFemme[i], gender: 'Femme' });
          }
        }
        return mixed;
    }
  };

  const ProductCard = ({ product, index }) => {
    const isHovered = hoveredProduct === product.id;
    
    return (
      <div 
        className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"
      >
        <div 
          style={{
            ...styles.productCard,
            ...(isHovered ? styles.productCardHover : {}),
          }}
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
          onClick={() => setSelectedProduct(product)}
        >
          <div className="position-relative overflow-hidden">
            <img
              src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`}
              alt={product.nom}
              style={{
                ...styles.productImage,
                width: '100%',
              }}
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${product.id}/400/400`;
              }}
            />
            <button 
              style={styles.wishlistButton}
              onClick={(e) => { e.stopPropagation(); toast.info('Connectez-vous pour ajouter aux favoris'); }}
            >
              <i className="far fa-heart" style={{ color: '#f5576c' }}></i>
            </button>
            {isHovered && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '2rem 1rem 1rem',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <button 
                  style={{
                    ...styles.addToCartBtn,
                    marginTop: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                >
                  <i className="fas fa-eye"></i>
                  Voir détails
                </button>
              </div>
            )}
          </div>
          <div style={styles.productBody}>
            <p style={styles.productCategory}>{product.categorie}</p>
            <h5 style={styles.productTitle} className="text-truncate" title={product.nom}>
              {product.nom}
            </h5>
            <div className="d-flex align-items-center justify-content-between">
              <span style={styles.productPrice}>{product.prix?.toFixed(2)} €</span>
              <div className="d-flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: i < 4 ? '#ffc107' : '#e0e0e0', fontSize: '0.75rem' }}></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductModal = () => {
    if (!selectedProduct) return null;

    return (
      <div style={styles.modal} onClick={() => setSelectedProduct(null)}>
        <div 
          style={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="row g-0">
            <div className="col-md-6">
              <img
                src={selectedProduct.imageUrl || `https://picsum.photos/seed/${selectedProduct.id}/600/600`}
                alt={selectedProduct.nom}
                style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', borderRadius: '2rem 0 0 2rem' }}
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${selectedProduct.id}/600/600`;
                }}
              />
            </div>
            <div className="col-md-6 p-4 p-md-5 d-flex flex-column">
              <button 
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#faf6f2',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <i className="fas fa-times" style={{ color: '#a67c52' }}></i>
              </button>
              
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#5c4033', marginBottom: '0.5rem' }}>
                {selectedProduct.nom}
              </h2>
              
              <p style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {selectedProduct.categorie}
              </p>
              
              <div className="d-flex align-items-center gap-3 mb-3">
                <span style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #a67c52 0%, #8b6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {selectedProduct.prix?.toFixed(2)} €
                </span>
                <div className="d-flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star" style={{ color: i < 4 ? '#ffc107' : '#e0e0e0' }}></i>
                  ))}
                  <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '0.5rem' }}>(24 avis)</span>
                </div>
              </div>
              
              {selectedProduct.description && (
                <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  {selectedProduct.description}
                </p>
              )}
              
              <div style={{ 
                background: 'linear-gradient(135deg, #faf6f2 0%, #fff 100%)', 
                borderRadius: '1rem', 
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(166, 124, 82, 0.2)',
              }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i className="fas fa-shipping-fast" style={{ color: '#a67c52', fontSize: '1.2rem' }}></i>
                  <span style={{ color: '#5c4033', fontWeight: '600' }}>Livraison gratuite dès 50€</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i className="fas fa-undo" style={{ color: '#a67c52', fontSize: '1.2rem' }}></i>
                  <span style={{ color: '#5c4033', fontWeight: '600' }}>Retours gratuits sous 30 jours</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i className="fas fa-shield-alt" style={{ color: '#a67c52', fontSize: '1.2rem' }}></i>
                  <span style={{ color: '#5c4033', fontWeight: '600' }}>Paiement 100% sécurisé</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div style={{ 
                  background: 'linear-gradient(135deg, #faf6f2 0%, #f5e6d3 100%)', 
                  borderRadius: '1rem', 
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <i className="fas fa-info-circle" style={{ color: '#a67c52', fontSize: '1.5rem' }}></i>
                  <div>
                    <Link to="/login" style={{ color: '#a67c52', fontWeight: '700' }}>Connectez-vous</Link>
                    {' '}ou{' '}
                    <Link to="/register" style={{ color: '#8b6914', fontWeight: '700' }}>créez un compte</Link>
                    {' '}pour ajouter au panier
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const features = [
    { icon: 'fas fa-truck', title: 'Livraison Express', desc: 'Livraison en 24-48h', color: '#a67c52' },
    { icon: 'fas fa-undo', title: 'Retours Faciles', desc: 'Retours gratuits 30 jours', color: '#c9a88e' },
    { icon: 'fas fa-lock', title: 'Paiement Sécurisé', desc: '100% transactions sécurisées', color: '#d4a574' },
    { icon: 'fas fa-headset', title: 'Support 24/7', desc: 'Assistance permanente', color: '#8b6914' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{styles.globalStyles}</style>
      
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        
        {/* Navbar */}
        <nav style={styles.navbar}>
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <Link to="/" style={styles.navBrand}>
                <i className="fas fa-gem me-2"></i>
                ProjetProduits
              </Link>
              <div className="d-flex gap-2">
                <Link to="/login" style={styles.navButton} className="text-decoration-none">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Connexion
                </Link>
                <Link to="/register" style={styles.navButtonFilled} className="text-decoration-none">
                  <i className="fas fa-user-plus me-2"></i>
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container" style={styles.heroContent}>
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <p style={{ 
                color: '#fff', 
                fontWeight: '600', 
                letterSpacing: '3px', 
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                ✨ Nouvelle Collection 2025
              </p>
              <h1 style={styles.heroTitle}>
                Découvrez le Style qui Vous Ressemble
              </h1>
              <p style={styles.heroSubtitle}>
                Explorez notre sélection exclusive de produits pour hommes et femmes. 
                Qualité premium, style unique, satisfaction garantie.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                <Link to="/register" style={styles.ctaButton} className="text-decoration-none">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Commencer le Shopping
                </Link>
                <a href="#products" style={styles.ctaButtonOutline} className="text-decoration-none">
                  <i className="fas fa-arrow-down me-2"></i>
                  Explorer
                </a>
              </div>
              
              {/* Stats */}
              <div className="d-flex gap-4 mt-5 justify-content-center justify-content-lg-start">
                <div className="text-center text-lg-start">
                  <h3 style={{ color: '#fff', fontWeight: '800', marginBottom: '0' }}>10K+</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Clients Satisfaits</p>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                <div className="text-center text-lg-start">
                  <h3 style={{ color: '#fff', fontWeight: '800', marginBottom: '0' }}>500+</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Produits</p>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                <div className="text-center text-lg-start">
                  <h3 style={{ color: '#fff', fontWeight: '800', marginBottom: '0' }}>4.9</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Note Moyenne</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div style={{ 
                position: 'relative',
                animation: 'float 6s ease-in-out infinite',
              }}>
                <div style={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                  borderRadius: '50%',
                  filter: 'blur(60px)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}></div>
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop"
                  alt="Shopping"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '2rem',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
                    position: 'relative',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <div className="container">
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-6 col-lg-3">
                <div 
                  style={styles.featureCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div 
                    style={{
                      ...styles.featureIcon,
                      background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
                      color: feature.color,
                    }}
                  >
                    <i className={feature.icon}></i>
                  </div>
                  <h5 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '0.5rem' }}>{feature.title}</h5>
                  <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div style={styles.productsSection} id="products">
        <div className="container">
          <div className="text-center mb-5">
            <p style={{ color: '#a67c52', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Notre Collection
            </p>
            <h2 style={styles.sectionTitle}>Produits Tendances</h2>
            <p style={{ color: '#888', maxWidth: '600px', margin: '1rem auto 2rem' }}>
              Découvrez notre sélection de produits soigneusement choisis pour vous
            </p>
            
           
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div style={{
                width: '60px',
                height: '60px',
                border: '3px solid #faf6f2',
                borderTop: '3px solid #a67c52',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: '#888' }}>Chargement des produits...</p>
            </div>
          ) : getDisplayedProducts().length === 0 ? (
            <div className="text-center py-5">
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #faf6f2 0%, #fff 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#a67c52' }}></i>
              </div>
              <h4 style={{ color: '#5c4033', fontWeight: '700' }}>Aucun produit disponible</h4>
              <p style={{ color: '#888' }}>Revenez bientôt pour découvrir nos nouveautés</p>
            </div>
          ) : (
            <div className="row">
              {getDisplayedProducts().map((product, index) => (
                <ProductCard key={`${product.gender}-${product.id}-${index}`} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div style={{ background: 'linear-gradient(135deg, #c9a88e 0%, #a67c52 100%)', padding: '5rem 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start text-white mb-4 mb-lg-0">
              <h3 style={{ fontWeight: '800', marginBottom: '1rem' }}>
                <i className="fas fa-envelope me-2"></i>
                Restez Informé
              </h3>
              <p style={{ opacity: 0.9, marginBottom: 0 }}>
                Inscrivez-vous pour recevoir nos offres exclusives et nouveautés
              </p>
            </div>
            <div className="col-lg-6">
              <div className="d-flex gap-2">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50px',
                    padding: '1rem 1.5rem',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
                <button style={{
                  background: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '1rem 2rem',
                  fontWeight: '700',
                  color: '#a67c52',
                  whiteSpace: 'nowrap',
                }}>
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <h4 style={{ fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fff 0%, #f5e6d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                <i className="fas fa-gem me-2"></i>
                ProjetProduits
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
                Votre destination shopping pour découvrir les meilleures tendances mode pour hommes et femmes.
              </p>
              <div className="d-flex gap-3 mt-3">
                {['facebook-f', 'twitter', 'instagram', 'pinterest'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <i className={`fab fa-${social}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="col-6 col-lg-2">
              <h6 style={{ fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>Boutique</h6>
              {['Nouveautés', 'Homme', 'Femme', 'Promotions'].map((link) => (
                <a key={link} href="#" style={styles.footerLink}>{link}</a>
              ))}
            </div>
            <div className="col-6 col-lg-2">
              <h6 style={{ fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>Aide</h6>
              {['FAQ', 'Livraison', 'Retours', 'Contact'].map((link) => (
                <a key={link} href="#" style={styles.footerLink}>{link}</a>
              ))}
            </div>
            <div className="col-lg-4">
              <h6 style={{ fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>Contact</h6>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                <i className="fas fa-map-marker-alt me-2"></i>
                123 Rue du Commerce, Paris
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                <i className="fas fa-phone me-2"></i>
                +33 1 23 45 67 89
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                <i className="fas fa-envelope me-2"></i>
                contact@projetproduits.com
              </p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: '2rem' }}>
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  © 2025 ProjetProduits. Tous droits réservés.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                <img 
                  src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/fr.svg" 
                  alt="FR" 
                  style={{ width: '24px', marginRight: '0.5rem', borderRadius: '3px' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Made with</span>
                <i className="fas fa-heart mx-2" style={{ color: '#f5576c' }}></i>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>in France</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && <ProductModal />}
    </div>
  );
};

export default HomePage;