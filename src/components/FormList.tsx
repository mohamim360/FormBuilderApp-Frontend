import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { fetchUserForms } from '../services/formService';
import { Form } from '../types/types';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        const data = await fetchUserForms();
setForms(data?.forms || []);

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
          <h3>My Forms</h3>
          <Button variant="primary" as={Link} to="/templates">
            Create New Form
          </Button>
        </Card.Header>
        <Card.Body>
          {!forms || forms.length === 0 ? (
            <Alert variant="info">You haven't submitted any forms yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Form Title</th>
                  <th>Template</th>
                  <th>Submitted</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td>{form.template?.title || 'Untitled Form'}</td>
                    <td>{form.template?.description?.substring(0, 50) || 'No description'}...</td>
                    <td>{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {form.template?.tags?.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1">
                          {tag}
                        </Badge>
                      ))}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        as={Link}
                        to={`/forms/${form.id}`}
                        className="me-2"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        as={Link}
                        to={`/forms/${form.id}/edit`}
                        className="me-2"
                      >
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm">
                        <FaTrash />
                      </Button>
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
