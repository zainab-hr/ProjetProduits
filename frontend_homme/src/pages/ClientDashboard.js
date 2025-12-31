import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ClientDashboard = () => {
  const { id: userId } = useParams();
  const { user } = useAuth();
  const { addToCart, openCart, getCartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [viewMode, setViewMode] = useState('grid');

  // Thème Homme : noir et gris pour un style e-commerce professionnel
  const themeColor = '#181818'; // Noir principal
  const themeAccent = '#6b7280'; // Gris neutre
  const themeGradient = 'linear-gradient(135deg, #181818 0%, #6b7280 100%)';

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Fetch both homme and femme products
      const [hommeRes, femmeRes] = await Promise.all([
        fetch('http://localhost:8080/api/homme/produits', { headers }),
        fetch('http://localhost:8080/api/femme/produits', { headers })
      ]);
      
      const hommeData = await hommeRes.json();
      const femmeData = await femmeRes.json();
      
      const hommeProducts = (Array.isArray(hommeData) ? hommeData : hommeData.data || []).map(p => ({ ...p, gender: 'Homme' }));
      const femmeProducts = (Array.isArray(femmeData) ? femmeData : femmeData.data || []).map(p => ({ ...p, gender: 'Femme' }));
      
      // 80% homme, 20% femme (random selection for femme)
      const hommeCount = Math.ceil(hommeProducts.length * 0.8);
      const femmeCount = Math.ceil(femmeProducts.length * 0.2);
      
      // Shuffle femme products to get random 20% each time
      const shuffledFemme = [...femmeProducts].sort(() => Math.random() - 0.5);
      const combined = [...hommeProducts.slice(0, hommeCount), ...shuffledFemme.slice(0, femmeCount)];
      
      setProducts(combined);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (product) => {
    toast.success(`❤️ Vous aimez "${product.nom}"`, {
      icon: '❤️'
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`🛒 "${product.nom}" ajouté au panier`, {
      icon: '🛒'
    });
  };

  const categories = [...new Set(products.map(p => p.categorie).filter(Boolean))].sort();

  const filteredProducts = products
    .filter(product => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (product.nom && product.nom.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower));
      
      // Category filter - exact match (categories are already properly cased)
      const matchesCategory = !categoryFilter || product.categorie === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'prix-asc') return (a.prix || 0) - (b.prix || 0);
      if (sortBy === 'prix-desc') return (b.prix || 0) - (a.prix || 0);
      return (a.nom || '').localeCompare(b.nom || '');
    });

  if (loading) {
    return (
      <div className="client-loading">
        <div className="spinner-container">
          <div className="spinner" style={{ borderTopColor: themeColor }}></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      {/* Hero Section */}
      <div className="hero-section hero-modern" style={{ background: themeGradient }}>
        <div className="hero-content">
          <span className="hero-badge hero-badge-modern">COLLECTION HOMME</span>
          <h1 className="hero-title-modern">Bienvenue, {user?.username || 'Client'} !</h1>
          <p className="hero-sub-modern">Découvrez notre sélection premium de produits pour homme, pensés pour l'élégance et la modernité.</p>
          <div className="hero-stats hero-stats-modern">
            <div className="stat-item">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Produits</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Catégories</span>
            </div>
          </div>
        </div>
        {/* Décor discret : motif SVG ou effet de fond subtil */}
        <div className="hero-bg-pattern"></div>
      </div>

      {/* Search & Filter Section */}
      <div className="container-fluid py-4">
        <div className="search-filter-section">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="nom">Trier par nom</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </div>
            <div className="col-md-2">
              <div className="view-toggle">
                <button
                  className={`btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  style={viewMode === 'grid' ? { backgroundColor: themeColor, color: 'white' } : {}}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  className={`btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  style={viewMode === 'list' ? { backgroundColor: themeColor, color: 'white' } : {}}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <span>{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state-client">
            <i className="fas fa-box-open"></i>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className={`products-container ${viewMode}`}>
            {filteredProducts.map(product => (
              <div key={product.id} className={`product-card-client ${viewMode}`}> 
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.nom} />
                  ) : (
                    <div className="placeholder-image" style={{ background: themeGradient }}>
                      {/* Image placeholder sans icône */}
                    </div>
                  )}
                  {product.categorie && (
                    <span className="category-tag" style={{ backgroundColor: themeColor }}>
                      {product.categorie}
                    </span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.nom}</h3>
                  <p className="product-description">
                    {product.description?.substring(0, viewMode === 'list' ? 200 : 80)}
                    {product.description?.length > (viewMode === 'list' ? 200 : 80) && '...'}
                  </p>
                  <div className="product-footer">
                    <span className="product-price" style={{ color: themeColor }}>
                      {product.prix?.toFixed(2)} €
                    </span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      style={{ background: themeGradient, minWidth: 110 }}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .client-dashboard {
          min-height: 100vh;
          background: #f3f4f6;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }

        .client-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }

        .spinner-container {
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #181818;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .hero-section.hero-modern {
          position: relative;
          padding: 64px 40px 56px 40px;
          color: #fff;
          background: linear-gradient(135deg, #181818 0%, #23272f 100%);
          border-radius: 22px;
          box-shadow: 0 10px 40px rgba(24,24,24,0.13);
          margin-bottom: 38px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          overflow: hidden;
        }

        .hero-badge-modern {
          background: rgba(255,255,255,0.08);
          color: #fff;
          padding: 10px 28px;
          border-radius: 18px;
          font-size: 1.08rem;
          font-weight: 700;
          margin-bottom: 22px;
          letter-spacing: 2px;
          text-transform: uppercase;
          box-shadow: 0 2px 12px rgba(24,24,24,0.10);
        }

        .hero-title-modern {
          font-size: 2.6rem;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
          color: #fff;
          text-shadow: 0 2px 16px rgba(24,24,24,0.18);
        }

        .hero-sub-modern {
          font-size: 1.18rem;
          opacity: 0.93;
          margin-bottom: 32px;
          color: #e5e7eb;
          font-weight: 400;
        }

        .hero-stats-modern {
          display: flex;
          gap: 48px;
        }

        .hero-bg-pattern {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 320px;
          height: 120px;
          background: url('data:image/svg+xml;utf8,<svg width="320" height="120" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse opacity="0.12" cx="160" cy="60" rx="160" ry="60" fill="white"/></svg>') no-repeat right bottom;
          pointer-events: none;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.6rem;
          font-weight: 700;
          color: #181818;
        }

        .stat-label {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        .search-filter-section {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(24,24,24,0.06);
          margin-bottom: 18px;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding-left: 16px;
          border-radius: 8px;
          border: 1.5px solid #d1d5db;
          transition: all 0.3s;
          background: #f3f4f6;
          font-size: 1rem;
        }

        .search-box input:focus {
          border-color: #181818;
          box-shadow: 0 0 0 2px #18181820;
        }

        .form-select {
          border-radius: 8px;
          border: 1.5px solid #d1d5db;
          background: #f3f4f6;
          font-size: 1rem;
        }

        .form-select:focus {
          border-color: #181818;
          box-shadow: 0 0 0 2px #18181820;
        }

        .view-toggle {
          display: flex;
          gap: 5px;
          background: #f3f4f6;
          padding: 5px;
          border-radius: 8px;
        }

        .view-toggle .btn {
          border: none;
          background: transparent;
          padding: 7px 14px;
          border-radius: 7px;
          transition: all 0.3s;
          color: #181818;
          font-weight: 500;
        }

        .view-toggle .btn.active {
          background: #181818;
          color: #fff;
        }

        .results-info {
          color: #181818;
          margin-bottom: 18px;
          font-size: 1rem;
        }

        .products-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
        }

        .products-container.list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .product-card-client {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(24,24,24,0.10);
          transition: all 0.3s cubic-bezier(.4,2,.3,1);
          border: 1.5px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          min-height: 370px;
        }

        .product-card-client:hover {
          box-shadow: 0 12px 40px rgba(24,24,24,0.16);
          border-color: #181818;
          transform: translateY(-4px) scale(1.02);
        }

        .product-card-client.list {
          flex-direction: row;
        }

        .product-card-client.list .product-image {
          width: 220px;
          flex-shrink: 0;
        }

        .product-card-client.list .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .product-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #f3f4f6;
          border-bottom: 1.5px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
          border-radius: 0 0 18px 18px;
        }

        .product-card-client:hover .product-image img {
          transform: scale(1.06);
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #bdbdbd;
          opacity: 0.7;
          background: #f3f4f6;
          border-radius: 0 0 18px 18px;
        }

        .category-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          color: #fff;
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          background: #181818;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }

        .product-info {
          padding: 22px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .product-info h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #181818;
          margin-bottom: 4px;
          letter-spacing: 0.01em;
        }

        .product-description {
          color: #6b7280;
          font-size: 1.01rem;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .product-price {
          font-size: 1.18rem;
          font-weight: 700;
          color: #181818;
        }

        .add-to-cart-btn {
          border: none;
          color: #fff;
          padding: 10px 22px;
          border-radius: 22px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          background: #181818;
          font-size: 1.01rem;
          box-shadow: 0 2px 8px rgba(24,24,24,0.08);
        }

        .add-to-cart-btn:hover {
          background: #6b7280;
          color: #fff;
        }

        .empty-state-client {
          text-align: center;
          padding: 60px 16px;
          color: #6b7280;
        }

        .empty-state-client h3 {
          font-size: 1.3rem;
          color: #181818;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 28px 10px;
            flex-direction: column;
            text-align: center;
          }

          .hero-content h1 {
            font-size: 1.3rem;
          }

          .hero-stats {
            justify-content: center;
          }

          .product-card-client.list {
            flex-direction: column;
          }

          .product-card-client.list .product-image {
            width: 100%;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
