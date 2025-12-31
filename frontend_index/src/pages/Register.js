import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Register.css';

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
    <div className="register-page">
      <div className="register-card">
        <div className="text-center">
         
          <h2 className="register-title">Inscription</h2>
          <p className="register-subtitle">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-input-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
            />
            <i className="fas fa-user input-icon"></i>
          </div>

          <div className="register-input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          <div className="register-genre-section">
            <span className="register-genre-label">Genre</span>
            <div className="register-genre-options">
              <div className="register-genre-option">
                <input
                  type="radio"
                  name="genre"
                  id="genreHomme"
                  value="HOMME"
                  checked={formData.genre === 'HOMME'}
                  onChange={handleChange}
                />
                <label htmlFor="genreHomme">
                  <i className="fas fa-mars"></i> Homme
                </label>
              </div>
              <div className="register-genre-option">
                <input
                  type="radio"
                  name="genre"
                  id="genreFemme"
                  value="FEMME"
                  checked={formData.genre === 'FEMME'}
                  onChange={handleChange}
                />
                <label htmlFor="genreFemme">
                  <i className="fas fa-venus"></i> Femme
                </label>
              </div>
            </div>
          </div>

          <div className="register-input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <div className="register-input-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="register-spinner"></span>
                Inscription...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                S'inscrire
              </>
            )}
          </button>

          <div className="register-divider">
            <span>ou</span>
          </div>

          <div className="register-login-link">
            <span>Déjà un compte? </span>
            <Link to="/login">Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
