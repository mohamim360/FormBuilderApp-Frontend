import axios from "axios";
import { Template } from "../types/types";
import { AirtableService } from "./airtableService";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/templates`;

export const TemplateService = {
  async createTemplate(templateData: unknown) {
    try {
      console.log("Creating template with data:", templateData);
      const response = await axios.post(API_BASE_URL, templateData);
      await AirtableService.createTemplate({
        name: templateData.title,
        description: templateData.description,
        category: templateData.topic,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },

  async updateTemplate(id: unknown, templateData: unknown) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, templateData);
      return response.data;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },

  async getTemplate(id: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching template:", error);
      throw error;
    }
  },

  async deleteTemplate(id: string) {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },

  async getUserTemplates() {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/templates`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user templates:", error);
      throw error;
    }
  },
  async searchTemplates(
    query: string,
    page: number = 1,
    limit: number = 8
  ): Promise<{
    templates: Template[];
    total: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          q: query,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching templates:", error);
      throw error;
    }
  },

  async getLatestTemplates(limit: number = 4): Promise<Template[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/latest`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching latest templates:", error);
      throw error;
    }
  },

  async getPopularTemplates(limit: number = 4): Promise<Template[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/popular`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular templates:", error);
      throw error;
    }
  },
  async getPopularTags(
    limit: number = 50
  ): Promise<{ id: string; name: string; count: number }[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tags/popular`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular tags:", error);
      throw error;
    }
  },
  // Add these to your existing TemplateService in src/services/template.service.ts

  async getComments(templateId: string, page: number = 1, limit: number = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${templateId}/comments`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  async addComment(templateId: string, content: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${templateId}/comments`,
        { content }, // Make sure this matches what the server expects
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  async likeTemplate(templateId: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/${templateId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking template:", error);
      throw error;
    }
  },

  async unlikeTemplate(templateId: string) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${templateId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error unliking template:", error);
      throw error;
    }
  },

  async checkUserLike(templateId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${templateId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error checking user like:", error);
      throw error;
    }
  },
  async getTemplateForms(
    templateId: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${templateId}/forms`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching template forms:", error);
      throw error;
    }
  },

  async getTemplateStats(templateId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${templateId}/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching template stats:", error);
      throw error;
    }
  },
  async uploadImage(formData: FormData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
};
