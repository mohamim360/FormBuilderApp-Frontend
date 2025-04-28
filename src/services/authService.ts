import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

// Add axios interceptor for token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  },

  async register(email: string, name: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      email,
      name,
      password,
    });
    return response.data;
  },

  async getMe() {
    const response = await axios.get(`${API_BASE_URL}/me`);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },
};