import axios from 'axios';
import {
  User,
  AuthResponse,
  QuestionType,
  Template,
  Question,
  Form,
  Answer,
  Comment,
  PaginatedResponse,
  TemplateStats
} from '../types/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: async (email: string, name: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { email, name, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User Service
export const userService = {
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Template Service
export const templateService = {
  createTemplate: async (
    data: {
      title: string;
      description: string;
      topic: string;
      isPublic: boolean;
      access: 'PUBLIC' | 'RESTRICTED';
      questions: Array<{
        title: string;
        description?: string;
        type: QuestionType;
        isRequired: boolean;
        showInTable: boolean;
        options?: string[];
      }>;
      tags: string[];
      allowedUserIds?: string[];
    },
    image?: File
  ): Promise<Template> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('topic', data.topic);
    formData.append('isPublic', String(data.isPublic));
    formData.append('accessType', data.access);
    formData.append('questions', JSON.stringify(data.questions));
    formData.append('tags', JSON.stringify(data.tags));
    if (data.allowedUserIds) {
      formData.append('allowedUserIds', JSON.stringify(data.allowedUserIds));
    }
    if (image) {
      formData.append('image', image);
    }

    const response = await api.post('/templates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTemplateById: async (id: string): Promise<Template> => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  updateTemplate: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      topic: string;
      isPublic: boolean;
      access: 'PUBLIC' | 'RESTRICTED';
      questions: Array<{
        id?: string;
        title: string;
        description?: string;
        type: QuestionType;
        isRequired: boolean;
        showInTable: boolean;
        options?: string[];
      }>;
      tags: string[];
      allowedUserIds?: string[];
    }>,
    image?: File
  ): Promise<Template> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.topic) formData.append('topic', data.topic);
    if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));
    if (data.access) formData.append('access', data.access);
    if (data.questions) formData.append('questions', JSON.stringify(data.questions));
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.allowedUserIds) formData.append('allowedUserIds', JSON.stringify(data.allowedUserIds));
    if (image) {
      formData.append('image', image);
    }

    const response = await api.put(`/templates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },

  searchTemplates: async (query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Template>> => {
    const response = await api.get(`/templates/search?query=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },

  getPopularTemplates: async (limit: number = 5): Promise<Template[]> => {
    const response = await api.get(`/templates/popular?limit=${limit}`);
    return response.data;
  },

  getLatestTemplates: async (limit: number = 10): Promise<Template[]> => {
    const response = await api.get(`/templates/latest?limit=${limit}`);
    return response.data;
  },

  getTemplatesByTag: async (tag: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Template>> => {
    const response = await api.get(`/templates/tag/${tag}?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserTemplates: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Template>> => {
    const response = await api.get(`/templates/user/templates?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTemplateForms: async (templateId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Form>> => {
    const response = await api.get(`/templates/${templateId}/forms?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTemplateStats: async (templateId: string): Promise<TemplateStats> => {
    const response = await api.get(`/templates/${templateId}/stats`);
    return response.data;
  },

  addComment: async (templateId: string, content: string): Promise<Comment> => {
    const response = await api.post(`/templates/${templateId}/comments`, { content });
    return response.data;
  },

  getComments: async (templateId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get(`/templates/${templateId}/comments?page=${page}&limit=${limit}`);
    return response.data;
  },

  likeTemplate: async (templateId: string): Promise<void> => {
    await api.post(`/templates/${templateId}/like`);
  },

  unlikeTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/templates/${templateId}/like`);
  },

  checkUserLike: async (templateId: string): Promise<{ liked: boolean }> => {
    const response = await api.get(`/templates/${templateId}/like`);
    return { liked: !!response.data };
  },
};

// Form Service
export const formService = {
  createForm: async (templateId: string, answers: Array<{
    questionId: string;
    textValue?: string;
    integerValue?: number;
    booleanValue?: boolean;
  }>): Promise<Form> => {
    const response = await api.post('/forms', { templateId, answers });
    return response.data;
  },

  getFormById: async (id: string): Promise<Form> => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  updateForm: async (
    id: string,
    answers: Array<{
      questionId: string;
      textValue?: string;
      integerValue?: number;
      booleanValue?: boolean;
    }>
  ): Promise<Form> => {
    const response = await api.put(`/forms/${id}`, { answers });
    return response.data;
  },

  deleteForm: async (id: string): Promise<void> => {
    await api.delete(`/forms/${id}`);
  },

  getUserForms: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Form>> => {
    const response = await api.get(`/forms/user?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default api;