// src/services/airtable.service.ts
import Airtable from 'airtable';
import { Template } from '../types/types';

const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
const tableName = 'Templates';

const base = new Airtable({ apiKey }).base(baseId);

export const AirtableService = {
  async getTemplates(): Promise<Template[]> {
    try {
      const records = await base(tableName).select().all();
      return records.map(record => ({
        id: record.id,
        ...record.fields
      })) as Template[];
    } catch (error) {
      console.error('Error fetching templates from Airtable:', error);
      throw error;
    }
  },

  async getTemplateById(id: string): Promise<Template> {
    try {
      const record = await base(tableName).find(id);
      return { id: record.id, ...record.fields } as Template;
    } catch (error) {
      console.error('Error fetching template from Airtable:', error);
      throw error;
    }
  },

// src/services/airtable.service.ts

async createTemplate(templateData: any): Promise<Template> {
  try {
    // Map your frontend fields to Airtable fields
       console.log("Creating template with data:", templateData);
    const airtableData = {
      // Assuming your Airtable has these exact field names:
      "Name": templateData.name,  // Note the capitalization
      "Description": templateData.description,
      "Category": templateData.category,
      // Add other fields as needed
    };
    
    const record = await base(tableName).create(airtableData);
    return { id: record.id, ...record.fields } as Template;
  } catch (error) {
    console.error('Error creating template in Airtable:', error);
    throw error;
  }
},

  async updateTemplate(id: string, templateData: Partial<Template>): Promise<Template> {
    try {
      const record = await base(tableName).update(id, templateData);
      return { id: record.id, ...record.fields } as Template;
    } catch (error) {
      console.error('Error updating template in Airtable:', error);
      throw error;
    }
  },

  async searchTemplates(query: string): Promise<Template[]> {
    try {
      const records = await base(tableName).select({
        filterByFormula: `SEARCH("${query}", {Name})`
      }).all();
      return records.map(record => ({
        id: record.id,
        ...record.fields
      })) as Template[];
    } catch (error) {
      console.error('Error searching templates in Airtable:', error);
      throw error;
    }
  }
};