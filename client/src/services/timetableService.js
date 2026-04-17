import api from './api';

export const timetableService = {
  getAll: async () => {
    const response = await api.get('/api/timetables/');
    return response.data;
  },

  rename: async (id, name) => {
    const response = await api.post(`/api/timetables/rename/${id}`, { name });
    return response.data;
  }
};

export default timetableService;
