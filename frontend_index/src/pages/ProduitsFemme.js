import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FemmeService from '../services/femmeService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const ProduitsFemme = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await FemmeService.getAllProduits();
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}"?`)) {
      try {
        await FemmeService.deleteProduit(product.id);
        toast.success('Produit supprimé avec succès');
        loadProducts();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleView = async (product) => {
    try {
      toast.info(`Consultation du produit: ${product.nom}`);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handleLike = async (product) => {
    try {
      toast.success(`❤️ Vous aimez "${product.nom}"`);
    } catch (error) {
      console.error('Error recording like:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await FemmeService.updateProduit(selectedProduct.id, formData);
        toast.success('Produit modifié avec succès');
      } else {
        await FemmeService.createProduit(formData);
        toast.success('Produit créé avec succès');
      }
      setShowModal(false);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const categories = [...new Set(products.map(p => p.categorie))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categorie === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">
            <i className="fas fa-box me-2" style={{ color: '#d63384' }}></i>
            Produits Femme
          </h1>
          <p className="text-muted mb-0">Gérez les produits de la section Femme</p>
        </div>
        <button className="btn btn-danger" onClick={handleCreate}>
          <i className="fas fa-plus me-2"></i>
          Nouveau produit
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4 mb-2">
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
        <div className="col-md-2 mb-2">
          <span className="badge bg-danger fs-6 w-100 py-2">
            {filteredProducts.length} produit(s)
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box-open"></i>
          <h4>Aucun produit trouvé</h4>
          <p className="text-muted">Commencez par créer un nouveau produit</p>
          <button className="btn btn-danger" onClick={handleCreate}>
            <i className="fas fa-plus me-2"></i>
            Créer un produit
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <ProductCard
                product={product}
                type="femme"
                onView={handleView}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
        type="femme"
      />
    </div>
  );
};

export default ProduitsFemme;
