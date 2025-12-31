import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      if (response.success) {
        toast.success('Connexion réussie!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="fas fa-shopping-bag fa-3x text-primary mb-3"></i>
          <h2>Connexion</h2>
          <p className="text-muted">Bienvenue sur Projet Produits</p>
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
            />
            <label htmlFor="username">Nom d'utilisateur</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Mot de passe</label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Connexion...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Se connecter
              </>
            )}
          </button>

          <div className="text-center">
            <span className="text-muted">Pas encore de compte? </span>
            <Link to="/register" className="text-decoration-none">
              S'inscrire
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
