import api from './api';

const HommeService = {
  // Users
  getAllUsers: async () => {
    const response = await api.get('/api/homme/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/homme/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/api/homme/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/homme/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/homme/users/${id}`);
    return response.data;
  },

  searchUsers: async (nom) => {
    const response = await api.get(`/api/homme/users/search?nom=${nom}`);
    return response.data;
  },

  // Products
  getAllProduits: async () => {
    const response = await api.get('/api/homme/produits');
    return response.data;
  },

  getProduitById: async (id) => {
    const response = await api.get(`/api/homme/produits/${id}`);
    return response.data;
  },

  createProduit: async (produitData) => {
    const response = await api.post('/api/homme/produits', produitData);
    return response.data;
  },

  updateProduit: async (id, produitData) => {
    const response = await api.put(`/api/homme/produits/${id}`, produitData);
    return response.data;
  },

  deleteProduit: async (id) => {
    const response = await api.delete(`/api/homme/produits/${id}`);
    return response.data;
  },

  getProduitsByCategorie: async (categorie) => {
    const response = await api.get(`/api/homme/produits/categorie/${categorie}`);
    return response.data;
  },

  searchProduits: async (nom) => {
    const response = await api.get(`/api/homme/produits/search?nom=${nom}`);
    return response.data;
  },

  // Interactions
  getAllInteractions: async () => {
    const response = await api.get('/api/homme/interactions');
    return response.data;
  },

  createInteraction: async (interactionData) => {
    const response = await api.post('/api/homme/interactions', interactionData);
    return response.data;
  },

  getInteractionsByUser: async (userId) => {
    const response = await api.get(`/api/homme/interactions/user/${userId}`);
    return response.data;
  },

  getInteractionsByProduit: async (produitId) => {
    const response = await api.get(`/api/homme/interactions/produit/${produitId}`);
    return response.data;
  },

  getTrainingData: async () => {
    const response = await api.get('/api/homme/interactions/training-data');
    return response.data;
  },
};

export default HommeService;
