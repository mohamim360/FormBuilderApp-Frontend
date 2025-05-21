import { AirtableService } from "./airtableService";
import { TemplateService } from "./templateService";

export async function syncTemplatesToAirtable() {
  try {
    // Get the raw response from TemplateService
    const response = await TemplateService.getUserTemplates();
    
    // Handle both array and object responses
    let templates = [];
    if (Array.isArray(response)) {
      templates = response;
    } else if (response && Array.isArray(response.templates)) {
      templates = response.templates;
    } else {
      throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
    }

    console.log(`Found ${templates.length} templates to sync`);

    const results = {
      successCount: 0,
      errors: [] as Array<{templateId: string, error: string}>
    };

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      try {
        console.log(`Syncing template ${i + 1}/${templates.length}: ${template.title}`);
        
        await AirtableService.createTemplate({
          name: template.title,
          content: template.description || '',
          tags: template.tags?.map(t => t.name) || [],
        });
        
        results.successCount++;
        
        // Rate limiting
        if (i < templates.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      } catch (error) {
        results.errors.push({
          templateId: template.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Failed to sync template ${template.title}:`, error);
      }
    }

    return {
      success: results.errors.length === 0,
      ...results
    };
  } catch (error) {
    console.error('Sync failed completely:', error);
    return {
      success: false,
      successCount: 0,
      errors: [{
        templateId: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      }]
    };
  }
}