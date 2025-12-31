import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import HommeService from '../services/hommeService';
import FemmeService from '../services/femmeService';
import UserModal from '../components/UserModal';
import api from '../services/api';

const UsersHomme = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await HommeService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${user.nom}"?`)) {
      try {
        // Delete from homme-service
        await HommeService.deleteUser(user.id);
        // Also delete from index-service (auth database) by email
        try {
          await api.delete(`/auth/users/email/${encodeURIComponent(user.email)}`);
        } catch (authError) {
          console.warn('Could not delete from auth database:', authError);
        }
        toast.success('Utilisateur supprimé avec succès');
        loadUsers();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const { genre, ...userData } = formData;
      if (selectedUser) {
        await HommeService.updateUser(selectedUser.id, userData);
        toast.success('Utilisateur modifié avec succès');
      } else {
        // Create user in the appropriate service based on genre
        if (genre === 'femme') {
          await FemmeService.createUser(userData);
          toast.success('Utilisateur créé avec succès dans la section Femme');
        } else {
          await HommeService.createUser(userData);
          toast.success('Utilisateur créé avec succès');
        }
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">
            <i className="fas fa-users me-2 text-primary"></i>
            Utilisateurs Homme
          </h1>
          <p className="text-muted mb-0">Gérez les utilisateurs de la section Homme</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="fas fa-user-plus me-2"></i>
          Nouvel utilisateur
        </button>
      </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 text-end">
          <span className="badge bg-primary fs-6 py-2 px-3">
            {filteredUsers.length} utilisateur(s)
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-users"></i>
          <h4>Aucun utilisateur trouvé</h4>
          <p className="text-muted">Commencez par créer un nouvel utilisateur</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="fas fa-user-plus me-2"></i>
            Créer un utilisateur
          </button>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <span className="badge bg-secondary">{user.id}</span>
                    </td>
                    <td>
                      <i className="fas fa-male text-primary me-2"></i>
                      {user.nom}
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none">
                        {user.email}
                      </a>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEdit(user)}
                        title="Modifier"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user)}
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        type="homme"
        showGenreSelect={!selectedUser}
      />
    </div>
  );
};

export default UsersHomme;
