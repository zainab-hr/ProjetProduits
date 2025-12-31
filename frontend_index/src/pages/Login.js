import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Login.css';

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
      console.log('Login response:', response);
      console.log('User object:', JSON.stringify(response.data?.user, null, 2));
      if (response.success) {
        toast.success('Connexion réussie!');
        const user = response.data?.user;
        const userGenre = user?.genre;
        const userId = user?.id;
        console.log('User ID:', userId, 'Genre:', userGenre);
        if (userGenre === 'HOMME' && userId) {
          const url = 'http://localhost:3001/shop/' + userId;
          console.log('Redirecting to:', url);
          window.location.href = url;
          return;
        } else if (userGenre === 'FEMME' && userId) {
          const url = 'http://localhost:3002/shop/' + userId;
          console.log('Redirecting to:', url);
          window.location.href = url;
          return;
        } else {
          navigate('/dashboard');
        }
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
    <div className="login-page">
      <div className="login-card">
        <div className="text-center">
          
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Bienvenue sur notre boutique</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <i className="fas fa-user input-icon"></i>
          </div>

          <div className="login-input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Connexion...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Se connecter
              </>
            )}
          </button>

          <div className="login-divider">
            <span>ou</span>
          </div>

          <div className="login-register-link">
            <span>Pas encore de compte? </span>
            <Link to="/register">S'inscrire</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
