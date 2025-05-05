// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {  Container, Card, Alert, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import {  FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

import { User, Template } from '../types/types';

type AdminDashboardState = {
	users: User[];
	templates: Template[];
	loading: {
		users: boolean;
		templates: boolean;
	};
	error: {
		users: string | null;
		templates: string | null;
	};
	showUserModal: boolean;
	showTemplateModal: boolean;
	selectedUser: User | null;
	selectedTemplate: Template | null;
	searchTerm: string;
};

const AdminDashboard: React.FC = () => {
	const { user } = useAuth();
	const [state, setState] = useState<AdminDashboardState>({
		users: [],
		templates: [],
		loading: {
			users: true,
			templates: true,
		},
		error: {
			users: null,
			templates: null,
		},
		showUserModal: false,
		showTemplateModal: false,
		selectedUser: null,
		selectedTemplate: null,
		searchTerm: '',
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [activeTab, setActiveTab] = useState<'users' | 'templates'>('users');

	useEffect(() => {
		if (user?.role !== 'ADMIN') return;

		if (activeTab === 'users') {
			loadUsers();
		} 
	}, [activeTab, user]);

	const loadUsers = async () => {
		try {
			setState(prev => ({ ...prev, loading: { ...prev.loading, users: true } }));
			const response = await userService.getAllUsers();
			setState(prev => ({ ...prev, users: response.users, loading: { ...prev.loading, users: false } }));
		} catch (err) {
			setState(prev => ({
				...prev,
				error: { ...prev.error, users: err instanceof Error ? err.message : 'Failed to load users' },
				loading: { ...prev.loading, users: false },
			}));
		}
	};


	const handleUserRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
		try {
			await userService.updateUser(userId, { role: newRole });
			setState(prev => ({
				...prev,
				users: prev.users.map(u => u.id === userId ? { ...u, role: newRole } : u),
			}));
		} catch (err) {
			console.error('Error updating user role:', err);
		}
	};


	const handleDeleteUser = async (userId: string) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			try {
				await userService.deleteUser(userId);
				setState(prev => ({
					...prev,
					users: prev.users.filter(u => u.id !== userId),
				}));
			} catch (err) {
				console.error('Error deleting user:', err);
			}
		}
	};


	const filteredUsers = state.users.filter(user =>
		user.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
		user.email.toLowerCase().includes(state.searchTerm.toLowerCase())
	);



	if (user?.role !== 'ADMIN') {
		return (
			<Container className="my-5 text-center">
				<Alert variant="danger">
					<h4>Access Denied</h4>
					<p>You must be an administrator to access this page.</p>
				</Alert>
			</Container>
		);
	}

	return (
		<Container className="my-4">
	

		
			
			
						<>
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h2>User Management</h2>
								<Form.Control
									type="text"
									placeholder="Search users..."
									style={{ width: '300px' }}
									value={state.searchTerm}
									onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
								/>
							</div>

							<Card>
								<Card.Body>
									<Table striped bordered hover responsive>
										<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th>Role</th>

												<th>Created</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{filteredUsers.map(user => (
												<tr key={user.id}>
													<td>{user.name}</td>
													<td>{user.email}</td>
													<td>
														<Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'}>
															{user.role}
														</Badge>
													</td>

													<td>{new Date(user.createdAt).toLocaleDateString()}</td>
													<td>
														<Button
															variant="outline-primary"
															size="sm"
															className="me-2"
															onClick={() => setState(prev => ({
																...prev,
																selectedUser: user,
																showUserModal: true,
															}))}
														>
															<FaEdit />
														</Button>
														<Button
															variant={user.role === 'ADMIN' ? 'outline-primary' : 'outline-danger'}
															size="sm"
															className="me-2"
															onClick={() => handleUserRoleChange(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
														>
															{user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
														</Button>

														<Button
															variant="outline-danger"
															size="sm"
															onClick={() => handleDeleteUser(user.id)}
														>
															<FaTrash />
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Card.Body>
							</Card>
						</>
				
			

			{/* User Edit Modal */}
			<Modal show={state.showUserModal} onHide={() => setState(prev => ({ ...prev, showUserModal: false }))}>
				<Modal.Header closeButton>
					<Modal.Title>Edit User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{state.selectedUser && (
						<Form>
							<Form.Group className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									defaultValue={state.selectedUser.name}
									onChange={(e) => setState(prev => ({
										...prev,
										selectedUser: { ...prev.selectedUser!, name: e.target.value },
									}))}
								/>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									defaultValue={state.selectedUser.email}
									onChange={(e) => setState(prev => ({
										...prev,
										selectedUser: { ...prev.selectedUser!, email: e.target.value },
									}))}
								/>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>Role</Form.Label>
								<Form.Select
									defaultValue={state.selectedUser.role}
									onChange={(e) => setState(prev => ({
										...prev,
										selectedUser: { ...prev.selectedUser!, role: e.target.value as 'USER' | 'ADMIN' },
									}))}
								>
									<option value="USER">User</option>
									<option value="ADMIN">Admin</option>
								</Form.Select>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Check
									type="switch"
									label="Blocked"
									defaultChecked={state.selectedUser.blocked}
									onChange={(e) => setState(prev => ({
										...prev,
										selectedUser: { ...prev.selectedUser!, blocked: e.target.checked },
									}))}
								/>
							</Form.Group>
						</Form>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setState(prev => ({ ...prev, showUserModal: false }))}>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
							if (state.selectedUser) {
								await userService.updateUser(state.selectedUser.id, {
									name: state.selectedUser.name,
									email: state.selectedUser.email,
									role: state.selectedUser.role,
									blocked: state.selectedUser.blocked,
								});
								setState(prev => ({ ...prev, showUserModal: false }));
								loadUsers();
							}
						}}
					>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>


		</Container>
	);
};

export default AdminDashboard;