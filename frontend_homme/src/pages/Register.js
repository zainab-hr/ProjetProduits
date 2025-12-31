import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    genre: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.genre) {
      toast.error('Veuillez sélectionner votre genre');
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData.username, formData.email, formData.password, formData.genre);
      if (response.success) {
        toast.success('Inscription réussie!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Erreur d\'inscription');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="fas fa-shopping-bag fa-3x text-primary mb-3"></i>
          <h2>Inscription</h2>
          <p className="text-muted">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
            />
            <label htmlFor="username">Nom d'utilisateur</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="mb-3">
            <label className="form-label">Genre</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  id="genreHomme"
                  value="HOMME"
                  checked={formData.genre === 'HOMME'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="genreHomme">
                  <i className="fas fa-mars me-1 text-primary"></i> Homme
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  id="genreFemme"
                  value="FEMME"
                  checked={formData.genre === 'FEMME'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="genreFemme">
                  <i className="fas fa-venus me-1 text-danger"></i> Femme
                </label>
              </div>
            </div>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <label htmlFor="password">Mot de passe</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Inscription...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                S'inscrire
              </>
            )}
          </button>

          <div className="text-center">
            <span className="text-muted">Déjà un compte? </span>
            <Link to="/login" className="text-decoration-none">
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
