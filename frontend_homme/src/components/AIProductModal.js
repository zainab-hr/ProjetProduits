import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ML_API_URL = 'http://localhost:8000';

const AIProductModal = ({ show, onClose, onProductCreated }) => {
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    prix: '',
    description: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const categories = [
    'Vêtements', 
    'Chaussures', 
    'Accessoires', 
    'Sport', 
    'Électronique',
    'Beauté', 
    'Bijoux',
    'Sacs',
    'Montres',
    'Parfums'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (!formData.nom || !formData.categorie) {
      toast.warning('Veuillez remplir le nom et la catégorie');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ML_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: formData.nom,
          product_type: formData.categorie,
          product_group: formData.description || '',
        }),
      });

      if (!response.ok) throw new Error('Erreur de prédiction');

      const data = await response.json();
      setPrediction(data);
      toast.info(`Genre prédit: ${data.predicted_gender} (${(data.confidence * 100).toFixed(1)}%)`);
    } catch (error) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.categorie || !formData.prix) {
      toast.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ML_API_URL}/predict-and-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          categorie: formData.categorie,
          prix: parseFloat(formData.prix),
          description: formData.description || null,
          image_url: formData.image_url || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création');
      }

      const data = await response.json();
      
      toast.success(
        <div>
          <strong>✅ Produit créé!</strong>
          <br />
          <small>
            Classé: <strong>{data.predicted_gender.toUpperCase()}</strong>
            <br />
            Confiance: {(data.confidence * 100).toFixed(1)}%
          </small>
        </div>
      );

      // Reset form
      setFormData({
        nom: '',
        categorie: '',
        prix: '',
        description: '',
        image_url: '',
      });
      setPrediction(null);
      
      if (onProductCreated) onProductCreated(data);
      onClose();
    } catch (error) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      categorie: '',
      prix: '',
      description: '',
      image_url: '',
    });
    setPrediction(null);
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h5 className="modal-title">
              <i className="fas fa-robot me-2"></i>
              Ajouter un produit avec IA
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* AI Info Banner */}
              <div className="alert alert-info d-flex align-items-center mb-4">
                <i className="fas fa-magic fa-2x me-3"></i>
                <div>
                  <strong>Classification automatique par IA</strong>
                  <br />
                  <small>Le modèle ML détermine automatiquement si ce produit est pour Homme ou Femme.</small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="fas fa-tag me-1"></i> Nom du produit *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Men's Hooded Sweatshirt..."
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="fas fa-folder me-1"></i> Catégorie *
                  </label>
                  <select
                    className="form-select form-select-lg"
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
                  <label className="form-label">
                    <i className="fas fa-euro-sign me-1"></i> Prix (€) *
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="prix"
                    value={formData.prix}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="29.99"
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="fas fa-image me-1"></i> URL de l'image
                  </label>
                  <input
                    type="url"
                    className="form-control form-control-lg"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">
                  <i className="fas fa-align-left me-1"></i> Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Description du produit..."
                ></textarea>
              </div>

              {/* Prediction Preview */}
              {prediction && (
                <div className={`alert ${prediction.predicted_gender === 'Homme' ? 'alert-primary' : 'alert-danger'} mt-3`}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className={`fas fa-${prediction.predicted_gender === 'Homme' ? 'mars' : 'venus'} fa-2x me-3`}></i>
                      <div>
                        <strong>Prédiction: {prediction.predicted_gender}</strong>
                        <div className="small">
                          Homme: {(prediction.probabilities?.Homme * 100 || 0).toFixed(1)}% | 
                          Femme: {(prediction.probabilities?.Femme * 100 || 0).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="h4 mb-0">{(prediction.confidence * 100).toFixed(1)}%</div>
                      <small>Confiance</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                <i className="fas fa-redo me-2"></i>Reset
              </button>
              <button 
                type="button" 
                className="btn btn-info"
                onClick={handlePredict}
                disabled={loading || !formData.nom || !formData.categorie}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Analyse...</>
                ) : (
                  <><i className="fas fa-eye me-2"></i>Prévisualiser</>
                )}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-success btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                ) : (
                  <><i className="fas fa-robot me-2"></i>Créer avec IA</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIProductModal;
