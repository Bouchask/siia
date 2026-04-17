import api from './api';

export const announcementService = {
  getAll: async () => {
    const response = await api.get('/api/announcements/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/announcements/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/api/announcements/', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/api/announcements/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/announcements/${id}`);
    return response.data;
  }
};

export default announcementService;
