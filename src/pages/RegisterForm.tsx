import React, { useState } from 'react';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { user, token } = await AuthService.register(email, name, password);
      authLogin(user, token);
      navigate('/dashboard'); 
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
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
      <Card className="shadow-lg border-0 w-100 mt-4" style={{ maxWidth: '420px', borderRadius: '20px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-3" style={{ fontWeight: 700 }}>Create Account</h2>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Sign up to get started
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                className="rounded-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
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
                placeholder="Create a password"
                className="rounded-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                className="rounded-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3 rounded-pill shadow-sm"
              style={{ padding: '10px 0', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <small className="text-muted">Already have an account?</small><br />
            <Link to="/login" className="fw-bold text-decoration-none">
              Login Here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;