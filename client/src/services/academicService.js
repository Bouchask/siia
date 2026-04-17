import api from './api';

export const academicService = {
  getSemesters: async () => {
    const response = await api.get('/api/academic/semesters');
    return response.data;
  },

  createSemester: async (payload) => {
    const response = await api.post('/api/academic/semesters', payload);
    return response.data;
  },

  getProfessors: async () => {
    const response = await api.get('/api/academic/professors');
    return response.data;
  }
};

export default academicService;
