import React from 'react'
import { Button, Form, Container, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const LoginForm: React.FC = () => {
	return (
		<Container className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
			<Card className="shadow-lg border-0 w-100" style={{ maxWidth: '420px', borderRadius: '20px' }}>
				<Card.Body className="p-4">
					<h2 className="text-center mb-4" style={{ fontWeight: 700 }}>Welcome Back</h2>
					<p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
						Please login to your account
					</p>

					<Form>
						<Form.Group className="mb-3">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter email"
								className="rounded-3"
							/>
							<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter password"
								className="rounded-3"
							/>
							<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
						</Form.Group>

						<Button
							variant="primary"
							type="submit"
							className="w-100 mt-3 rounded-pill shadow-sm"
							style={{ padding: '10px 0', fontWeight: 600 }}
						>
							Log In
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
	)
}

export default LoginForm
