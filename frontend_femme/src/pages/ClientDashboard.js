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

  // Nouveau thème : noir et violet pour un style e-commerce professionnel
  const themeColor = '#6c2eb6'; // Violet principal
  const themeAccent = '#000000'; // Noir
  const themeGradient = 'linear-gradient(135deg, #6c2eb6 0%, #000000 100%)';

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Fetch both femme and homme products
      const [femmeRes, hommeRes] = await Promise.all([
        fetch('http://localhost:8080/api/femme/produits', { headers }),
        fetch('http://localhost:8080/api/homme/produits', { headers })
      ]);
      
      const femmeData = await femmeRes.json();
      const hommeData = await hommeRes.json();
      
      const femmeProducts = (Array.isArray(femmeData) ? femmeData : femmeData.data || []).map(p => ({ ...p, gender: 'Femme' }));
      const hommeProducts = (Array.isArray(hommeData) ? hommeData : hommeData.data || []).map(p => ({ ...p, gender: 'Homme' }));
      
      // 80% femme, 20% homme (produits homme sélectionnés aléatoirement)
      const femmeCount = Math.ceil(femmeProducts.length * 0.8);
      const hommeCount = Math.ceil(hommeProducts.length * 0.2);
      
      // Sélection aléatoire des produits homme
      const shuffledHomme = [...hommeProducts].sort(() => Math.random() - 0.5);
      const randomHommeProducts = shuffledHomme.slice(0, hommeCount);
      
      const combined = [...femmeProducts.slice(0, femmeCount), ...randomHommeProducts];
      
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
      <div className="hero-section" style={{ background: themeGradient }}>
        <div className="hero-content">
          <div className="hero-badge">
            Collection Femme
          </div>
          <h1>Bienvenue, {user?.username || 'Cliente'}!</h1>
          <p>Découvrez notre sélection exclusive de produits pour femme</p>
          <div className="hero-stats">
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
        {/* Suppression de l'icône décorative */}
      </div>

      {/* Search & Filter Section */}
      <div className="container-fluid py-4">
        <div className="search-filter-section">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="search-box">
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
                  Grille
                </button>
                <button
                  className={`btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  style={viewMode === 'list' ? { backgroundColor: themeColor, color: 'white' } : {}}
                >
                  Liste
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
                  {/* Suppression de la product-overlay et des boutons icônes */}
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
                      style={{ background: themeGradient }}
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
          background: #f7f6fa;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }

        .client-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f6fa;
        }

        .spinner-container {
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e5e5;
          border-top: 4px solid #6c2eb6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .hero-section {
          padding: 48px 32px;
          color: #181028;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(108,46,182,0.08);
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-badge {
          background: #6c2eb6;
          color: #fff;
          padding: 7px 18px;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 18px;
          letter-spacing: 1px;
        }

        .hero-content h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .hero-content p {
          font-size: 1.1rem;
          opacity: 0.95;
          margin-bottom: 24px;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.6rem;
          font-weight: 700;
          color: #6c2eb6;
        }

        .stat-label {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        .search-filter-section {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(108,46,182,0.06);
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
          background: #f7f6fa;
          font-size: 1rem;
        }

        .search-box input:focus {
          border-color: #6c2eb6;
          box-shadow: 0 0 0 2px #6c2eb620;
        }

        .form-select {
          border-radius: 8px;
          border: 1.5px solid #d1d5db;
          background: #f7f6fa;
          font-size: 1rem;
        }

        .form-select:focus {
          border-color: #6c2eb6;
          box-shadow: 0 0 0 2px #6c2eb620;
        }

        .view-toggle {
          display: flex;
          gap: 5px;
          background: #f7f6fa;
          padding: 5px;
          border-radius: 8px;
        }

        .view-toggle .btn {
          border: none;
          background: transparent;
          padding: 7px 14px;
          border-radius: 7px;
          transition: all 0.3s;
          color: #6c2eb6;
          font-weight: 500;
        }

        .view-toggle .btn.active {
          background: #6c2eb6;
          color: #fff;
        }

        .results-info {
          color: #6c2eb6;
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
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(108,46,182,0.06);
          transition: all 0.3s ease;
          border: 1.5px solid #e5e5e5;
          display: flex;
          flex-direction: column;
        }

        .product-card-client:hover {
          box-shadow: 0 8px 32px rgba(108,46,182,0.10);
          border-color: #6c2eb6;
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
          height: 180px;
          overflow: hidden;
          background: #f7f6fa;
          border-bottom: 1.5px solid #e5e5e5;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .product-card-client:hover .product-image img {
          transform: scale(1.04);
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
          background: #f7f6fa;
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
          background: #6c2eb6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }

        .product-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-info h3 {
          font-size: 1.08rem;
          font-weight: 600;
          color: #181028;
          margin-bottom: 4px;
        }

        .product-description {
          color: #6c2eb6;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .product-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #6c2eb6;
        }

        .add-to-cart-btn {
          border: none;
          color: #fff;
          padding: 8px 18px;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          background: #6c2eb6;
          font-size: 1rem;
        }

        .add-to-cart-btn:hover {
          background: #181028;
        }

        .empty-state-client {
          text-align: center;
          padding: 60px 16px;
          color: #6c2eb6;
        }

        .empty-state-client h3 {
          font-size: 1.3rem;
          color: #181028;
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
