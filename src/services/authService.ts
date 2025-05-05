import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

// Add axios interceptor for token

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config}, (error) => {
  return Promise.reject(error);
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
  // Add to src/services/authService.ts
async getAllUsers() {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
},

async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const response = await axios.patch(`${API_BASE_URL}/users/${userId}/role`, { role });
  return response.data;
},

async updateUserStatus(userId: string, blocked: boolean) {
  const response = await axios.patch(`${API_BASE_URL}/users/${userId}/status`, { blocked });
  return response.data;
},

async deleteUser(userId: string) {
  await axios.delete(`${API_BASE_URL}/users/${userId}`);
},
};
