import api from './api';

export const eventService = {
  getAll: async () => {
    const response = await api.get('/api/events/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/api/events/', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/api/events/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  }
};

export default eventService;
