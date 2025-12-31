import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080';

const HomePage = () => {
  const [produitsHomme, setProduitsHomme] = useState([]);
  const [produitsFemme, setProduitsFemme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        // Handle both array and object with data property
        const hommeProducts = Array.isArray(hommeData) ? hommeData : (hommeData.data || []);
        setProduitsHomme(hommeProducts);
      }
      if (femmeRes.ok) {
        const femmeData = await femmeRes.json();
        // Handle both array and object with data property
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
        // Show 50% from each category, interleaved for variety
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

  const ProductCard = ({ product }) => (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div 
        className="card h-100 product-card border-0 shadow-sm"
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }}
        onClick={() => setSelectedProduct(product)}
      >
        <div className="position-relative">
          <img
            src={product.imageUrl || `https://picsum.photos/seed/${product.id}/300/300`}
            alt={product.nom}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${product.id}/300/300`;
            }}
          />
          <span 
            className={`position-absolute top-0 end-0 m-2 badge ${product.gender === 'Homme' ? 'bg-primary' : 'bg-danger'}`}
          >
            {product.gender}
          </span>
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate" title={product.nom}>
            {product.nom}
          </h6>
          <p className="text-muted small mb-2">{product.categorie}</p>
          <div className="mt-auto">
            <span className="h5 text-primary fw-bold">{product.prix?.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductModal = () => {
    if (!selectedProduct) return null;

    return (
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={() => setSelectedProduct(null)}
      >
        <div 
          className="modal-dialog modal-lg modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0">
              <h5 className="modal-title">{selectedProduct.nom}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSelectedProduct(null)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <img
                    src={selectedProduct.imageUrl || `https://picsum.photos/seed/${selectedProduct.id}/400/400`}
                    alt={selectedProduct.nom}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${selectedProduct.id}/400/400`;
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <span className={`badge ${selectedProduct.gender === 'Homme' ? 'bg-primary' : 'bg-danger'} mb-3`}>
                    {selectedProduct.gender}
                  </span>
                  <h4 className="text-primary fw-bold mb-3">
                    {selectedProduct.prix?.toFixed(2)} €
                  </h4>
                  <p className="text-muted mb-2">
                    <strong>Catégorie:</strong> {selectedProduct.categorie}
                  </p>
                  {selectedProduct.description && (
                    <p className="text-muted">
                      <strong>Description:</strong> {selectedProduct.description}
                    </p>
                  )}
                  <div className="alert alert-info mt-4">
                    <i className="fas fa-info-circle me-2"></i>
                    <Link to="/login" className="alert-link">Connectez-vous</Link> ou{' '}
                    <Link to="/register" className="alert-link">créez un compte</Link>{' '}
                    pour ajouter ce produit à votre panier.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold">
            <i className="fas fa-shopping-bag me-2"></i>
            ProjetProduits
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light">
              <i className="fas fa-sign-in-alt me-1"></i> Connexion
            </Link>
            <Link to="/register" className="btn btn-light">
              <i className="fas fa-user-plus me-1"></i> S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div 
        className="py-5 text-white text-center"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '2rem'
        }}
      >
        <div className="container py-4">
          <h1 className="display-4 fw-bold mb-3">
            <i className="fas fa-store me-3"></i>
            Bienvenue sur ProjetProduits
          </h1>
          <p className="lead mb-4">
            Découvrez notre collection de produits pour hommes et femmes
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light btn-lg px-4">
              <i className="fas fa-rocket me-2"></i>
              Commencer
            </Link>
            <a href="#products" className="btn btn-outline-light btn-lg px-4">
              <i className="fas fa-arrow-down me-2"></i>
              Voir les produits
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mb-5">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-4">
              <i className="fas fa-male fa-3x text-primary mb-3"></i>
              <h3 className="fw-bold">{produitsHomme.length}</h3>
              <p className="text-muted mb-0">Produits Homme</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-4">
              <i className="fas fa-female fa-3x text-danger mb-3"></i>
              <h3 className="fw-bold">{produitsFemme.length}</h3>
              <p className="text-muted mb-0">Produits Femme</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-4">
              <i className="fas fa-boxes fa-3x text-success mb-3"></i>
              <h3 className="fw-bold">{produitsHomme.length + produitsFemme.length}</h3>
              <p className="text-muted mb-0">Total Produits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container pb-5" id="products">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            <i className="fas fa-th-large me-2 text-primary"></i>
            Nos Produits
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3 text-muted">Chargement des produits...</p>
          </div>
        ) : getDisplayedProducts().length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
            <h4 className="text-muted">Aucun produit disponible</h4>
          </div>
        ) : (
          <div className="row">
            {getDisplayedProducts().map((product, index) => (
              <ProductCard key={`${product.gender}-${product.id}-${index}`} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <p className="mb-2">
            <i className="fas fa-heart text-danger me-1"></i>
            ProjetProduits - Classification IA des produits
          </p>
          <p className="small mb-0 opacity-75">
            © 2025 - Tous droits réservés
          </p>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal />
    </div>
  );
};

export default HomePage;
