import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  registerJobSeeker: async (formData: FormData) => {
    const response = await api.post('/auth/register/jobseeker', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  registerEmployer: async (formData: FormData) => {
    const response = await api.post('/auth/register/employer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const jobsAPI = {
  getAllJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  applyForJob: async (jobId: string, formData: FormData) => {
    const response = await api.post(`/applications/${jobId}`, formData);
    return response.data;
  }
};

export default api;