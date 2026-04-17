import api from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/api/users/');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/users/stats');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
};

export default userService;
