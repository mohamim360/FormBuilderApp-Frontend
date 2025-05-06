import React, { useState } from 'react';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await AuthService.login(email, password);
      authLogin(user, token);
      navigate('/'); // Redirect to dashboard after login
    } catch (err) {
       const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
      <div className="position-absolute top-0 start-50 translate-middle-x mt-4">
        <Link to="/" className="btn btn-outline-primary rounded-pill px-4 shadow-sm">
          ⬅ Back to Home
        </Link>
      </div>

      <Card className="shadow-lg border-0 w-100" style={{ maxWidth: '420px', borderRadius: '20px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4" style={{ fontWeight: 700 }}>Welcome Back</h2>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Please login to your account
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="rounded-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                className="rounded-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3 rounded-pill shadow-sm"
              style={{ padding: '10px 0', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <small className="text-muted">Don't have an account?</small><br />
            <Link to="/register" className="fw-bold text-decoration-none">
              Register Here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;