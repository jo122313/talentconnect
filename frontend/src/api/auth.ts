import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authAPI = {
  registerJobseeker: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/auth/jobseeker/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  registerEmployer: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/auth/employer/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  }
};

export default authAPI;