import React from 'react';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaList } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

const FormSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container className="my-5">
      <Card className="text-center">
        <Card.Header className="bg-success text-white">
          <h2>Form Submitted Successfully!</h2>
        </Card.Header>
        <Card.Body>
          <FaCheckCircle size={80} className="text-success mb-4" />
          <Alert variant="success" className="mb-4">
            <h4>Thank you for your submission!</h4>
            <p className="mb-0">
              Your form has been successfully submitted with ID: <strong>{id}</strong>
            </p>
          </Alert>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/">
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
              >
                <FaHome /> Return Home
              </Button>
            </Link>
            <Link to="/forms">
              <Button
                variant="secondary"


                className="d-flex align-items-center gap-2"
              >
                <FaList /> View My Submissions
              </Button>
            </Link>

          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          You can view or edit this submission anytime from your forms list
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default FormSuccess;