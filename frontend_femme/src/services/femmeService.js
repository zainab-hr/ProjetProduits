import api from './api';

const FemmeService = {
  // Users
  getAllUsers: async () => {
    const response = await api.get('/api/femme/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/femme/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/api/femme/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/femme/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/femme/users/${id}`);
    return response.data;
  },

  searchUsers: async (nom) => {
    const response = await api.get(`/api/femme/users/search?nom=${nom}`);
    return response.data;
  },

  // Products
  getAllProduits: async () => {
    const response = await api.get('/api/femme/produits');
    return response.data;
  },

  getProduitById: async (id) => {
    const response = await api.get(`/api/femme/produits/${id}`);
    return response.data;
  },

  createProduit: async (produitData) => {
    const response = await api.post('/api/femme/produits', produitData);
    return response.data;
  },

  updateProduit: async (id, produitData) => {
    const response = await api.put(`/api/femme/produits/${id}`, produitData);
    return response.data;
  },

  deleteProduit: async (id) => {
    const response = await api.delete(`/api/femme/produits/${id}`);
    return response.data;
  },

  getProduitsByCategorie: async (categorie) => {
    const response = await api.get(`/api/femme/produits/categorie/${categorie}`);
    return response.data;
  },

  searchProduits: async (nom) => {
    const response = await api.get(`/api/femme/produits/search?nom=${nom}`);
    return response.data;
  },

  // Interactions
  getAllInteractions: async () => {
    const response = await api.get('/api/femme/interactions');
    return response.data;
  },

  createInteraction: async (interactionData) => {
    const response = await api.post('/api/femme/interactions', interactionData);
    return response.data;
  },

  getInteractionsByUser: async (userId) => {
    const response = await api.get(`/api/femme/interactions/user/${userId}`);
    return response.data;
  },

  getInteractionsByProduit: async (produitId) => {
    const response = await api.get(`/api/femme/interactions/produit/${produitId}`);
    return response.data;
  },

  getTrainingData: async () => {
    const response = await api.get('/api/femme/interactions/training-data');
    return response.data;
  },
};

export default FemmeService;
