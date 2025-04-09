import React from 'react'
import { Button, Form, Container, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const RegisterForm: React.FC = () => {
	return (
		<Container className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
			<Card className="shadow-lg border-0 w-100" style={{ maxWidth: '420px', borderRadius: '20px' }}>
				<Card.Body className="p-4">
					<h2 className="text-center mb-3" style={{ fontWeight: 700 }}>Create Account</h2>
					<p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
						Sign up to get started
					</p>

					<Form>
						<Form.Group className="mb-3">
							<Form.Label>Full Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter your name"
								className="rounded-3"
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter your email"
								className="rounded-3"
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Create a password"
								className="rounded-3"
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Re-enter password"
								className="rounded-3"
							/>
						</Form.Group>

						<Button
							variant="primary"
							type="submit"
							className="w-100 mt-3 rounded-pill shadow-sm"
							style={{ padding: '10px 0', fontWeight: 600 }}
						>
							Register
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
	)
}

export default RegisterForm
