import { useState, FormEvent } from 'react';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaSalesforce, FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase } from 'react-icons/fa';

interface SalesforceFormProps {
  userId: string;
  userName: string;
  userEmail: string;
}

export default function SalesforceForm({
  userId,
  userName,
  userEmail
}: SalesforceFormProps) {
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>(userName);
  const [email, setEmail] = useState<string>(userEmail);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${userId}/salesforce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone, company, jobTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to Salesforce');
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save to Salesforce');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="mb-3">
            <FaSalesforce size={48} className="text-primary mb-3" />
          </div>
          <h3 className="mb-3">Successfully Connected!</h3>
          <p className="text-muted">Your information has been saved to Salesforce</p>
        
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="text-center mb-4">
          <FaSalesforce size={32} className="text-primary mb-2" />
          <h3>Connect to Salesforce</h3>
          <p className="text-muted">Fill your information to create a Salesforce contact</p>
        </div>

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <div className="me-2">⚠️</div>
            <div>{error}</div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaUser className="me-2 text-muted" />
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaEnvelope className="me-2 text-muted" />
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaPhone className="me-2 text-muted" />
                  Phone Number
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="+1 (123) 456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaBuilding className="me-2 text-muted" />
                  Company
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Acme Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="d-flex align-items-center">
              <FaBriefcase className="me-2 text-muted" />
              Job Title
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Connecting...
                </>
              ) : (
                <>
                  <FaSalesforce className="me-2" />
                  Connect to Salesforce
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}