
import axios from 'axios';
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  // Add any other user properties you need
}

// Add other types as needed for your application

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const userService = {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ 
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get('', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  /**
   * Update user (admin or self)
   */
  async updateUser(
    id: string, 
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
      blocked?: boolean;
      password?: string;
    }
  ): Promise<User> {
    try {
      const response = await api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user (admin only)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Change user role (admin only)
   */
  async changeUserRole(id: string, role: UserRole): Promise<User> {
    try {
      const response = await api.patch(`/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  },

  /**
   * Block/unblock user (admin only)
   */

};

export default userService;