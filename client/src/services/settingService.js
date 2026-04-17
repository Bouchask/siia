import api from './api';

export const settingService = {
  getAll: async () => {
    const response = await api.get('/api/settings/');
    return response.data;
  },

  update: async (settings) => {
    const response = await api.post('/api/settings/', settings);
    return response.data;
  }
};

export default settingService;
