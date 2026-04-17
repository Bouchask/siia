import api from './api';

export const authService = {
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (formData) => {
    const response = await api.post('/api/auth/register', formData);
    return response.data;
  }
};

export default authService;
