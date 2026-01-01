import React, { useState, useEffect } from 'react';

const UserModal = ({ show, onHide, onSubmit, user, type, showGenreSelect = false }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    age: '',
    genre: type || 'homme',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        age: user.age || '',
        genre: type || 'homme',
      });
    } else {
      setFormData({
        nom: '',
        email: '',
        age: '',
        genre: type || 'homme',
      });
    }
  }, [user, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  const getButtonColor = () => {
    if (showGenreSelect) {
      return formData.genre === 'homme' ? 'primary' : 'danger';
    }
    return type === 'homme' ? 'primary' : 'danger';
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas fa-${user ? 'edit' : 'user-plus'} me-2`}></i>
              {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {showGenreSelect && !user && (
                <div className="mb-3">
                  <label className="form-label">Genre *</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="genre"
                        id="genreHomme"
                        value="homme"
                        checked={formData.genre === 'homme'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="genreHomme">
                        <i className="fas fa-male text-primary me-1"></i>
                        Homme
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="genre"
                        id="genreFemme"
                        value="femme"
                        checked={formData.genre === 'femme'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="genreFemme">
                        <i className="fas fa-female me-1" style={{ color: '#d63384' }}></i>
                        Femme
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
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
              
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Âge *</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="150"
                  required
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Annuler
              </button>
              <button type="submit" className={`btn btn-${getButtonColor()}`}>
                <i className="fas fa-save me-2"></i>
                {user ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
