import api from './api';

export const courseService = {
  getAll: async () => {
    const response = await api.get('/api/academic/courses');
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/api/academic/courses', payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/academic/courses/${id}`);
    return response.data;
  }
};

export default courseService;
