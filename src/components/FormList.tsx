import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { fetchUserForms, deleteForm } from '../services/formService';
import { Form } from '../types/types';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import {  TemplateService } from '../services/templateService';

interface FormWithTemplate extends Form {
  template?: {
    title: string;
    description: string;
    tags: string[];
  };
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<FormWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        const data = await fetchUserForms();
        const formsWithTemplates = await Promise.all(
          (data?.forms || []).map(async (form) => {
            try {
              const template = await TemplateService.getTemplate(form.templateId);
              return {
                ...form,
                template: {
                  title: template?.title || 'Untitled Template',
                  description: template?.description || '',
                  tags: template?.tags?.map(t => t.name) || [],
                }
              };
            } catch (err) {
              console.error(`Error loading template for form ${form.id}:`, err);
              return {
                ...form,
                template: {
                  title: 'Template not available',
                  description: '',
                  tags: [],
                }
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

  const handleDelete = async (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(formId);
        setForms(forms.filter(form => form.id !== formId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete form');
      }
    }
  };

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
          <h3>My Forms</h3>
       
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
                    <td>{form.template?.title || 'Untitled Form'}</td>
                    <td>{form.template?.description.substring(0, 50)}...</td>
                    <td>{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {form.template?.tags.map((tag, index) => (
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