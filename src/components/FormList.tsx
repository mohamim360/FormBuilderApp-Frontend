import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { fetchUserForms } from '../services/formService';
import { Form, Template } from '../types/types';
import { TemplateService } from '../services/templateService';

interface FormWithMinimalTemplate extends Omit<Form, 'template'> {
  template: {
    title: string;
    description: string;
    tags: string[];
  };
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<FormWithMinimalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        const rawForms = await fetchUserForms();
        console.log('Fetched forms:', rawForms); // Debugging line
        const formsWithTemplates = await Promise.all(
          rawForms.forms.map(async (form: Form) => {
            try {
              const template: Template = await TemplateService.getTemplate(form.templateId);
              return {
                ...form,
                template: {
                  title: template.title || 'Untitled Template',
                  description: template.description || '',
                  tags: template.tags?.map(t => t.name) || [],
                },
              };
            } catch (err) {
              console.error(`Error loading template for form ${form.id}:`, err);
              return {
                ...form,
                template: {
                  title: 'Template not available',
                  description: '',
                  tags: [],
                },
              };
            }
          })
        );

        setForms(formsWithTemplates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forms');
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>My Submissions</h3>
        </Card.Header>
        <Card.Body>
          {forms.length === 0 ? (
            <Alert variant="info">You haven't submitted any forms yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Form Title</th>
                  <th>Template</th>
                  <th>Submitted</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td>{form.template.title || 'Untitled Form'}</td>
                    <td>{form.template.description.substring(0, 50)}...</td>
                    <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                    <td>
                      {form.template.tags.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1">
                          {tag}
                        </Badge>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormList;
