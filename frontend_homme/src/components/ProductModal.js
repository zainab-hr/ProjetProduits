import React, { useState, useEffect } from 'react';

const ProductModal = ({ show, onHide, onSubmit, product, type }) => {
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    prix: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nom: product.nom || '',
        categorie: product.categorie || '',
        prix: product.prix || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setFormData({
        nom: '',
        categorie: '',
        prix: '',
        description: '',
        imageUrl: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      prix: parseFloat(formData.prix),
    });
  };

  if (!show) return null;

  const categories = type === 'homme' 
    ? ['Vêtements', 'Chaussures', 'Accessoires', 'Sport', 'Électronique']
    : ['Vêtements', 'Chaussures', 'Accessoires', 'Beauté', 'Bijoux'];

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas fa-${product ? 'edit' : 'plus'} me-2`}></i>
              {product ? 'Modifier le produit' : 'Nouveau produit'}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Catégorie *</label>
                  <select
                    className="form-select"
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Prix (€) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="prix"
                    value={formData.prix}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">URL Image</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Annuler
              </button>
              <button type="submit" className={`btn btn-${type === 'homme' ? 'primary' : 'danger'}`}>
                <i className="fas fa-save me-2"></i>
                {product ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
