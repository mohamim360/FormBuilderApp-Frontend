// api.ts
import axios from 'axios';
import { Form, Template } from '../types/types';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`; // Adjust based on your backend URL
export interface PaginatedResponse<T> {
  forms: T[];           // was: `data: T[]`
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTemplates = async (): Promise<Template[]> => {
  const response = await api.get('/templates');
  return response.data;
};

export const fetchTemplateById = async (id: string): Promise<Template> => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};
export interface PaginatedForms {
  forms: Form[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchUserForms = async (): Promise<PaginatedForms> => {
  const response = await api.get('/forms/user');
  return response.data;
};
export const fetchUserForms_dash = async (): Promise<Form[]> => {
  const response = await api.get('/forms/user');
  return response.data;
};

export const fetchFormById = async (id: string): Promise<Form> => {
  const response = await api.get(`/forms/${id}`);
  return response.data;
};

export const submitForm = async (formData: Omit<Form, 'id'>): Promise<Form> => {
  const response = await api.post<Form>('/forms', formData);
  return response.data;
};

// export const updateForm = async (id: string, formData): Promise<Form> => {
//   const response = await api.put(`/forms/${id}`, formData);
//   return response.data;
// };

export const deleteForm = async (id: string): Promise<void> => {
  await api.delete(`/forms/${id}`);
};

export default api;