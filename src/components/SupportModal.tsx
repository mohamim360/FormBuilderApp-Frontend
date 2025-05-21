import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { uploadSupportTicket } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

interface SupportModalProps {
  show: boolean;
  handleClose: () => void;
}

const SupportModal = ({ show, handleClose }: SupportModalProps) => {
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Average');
  const { user } = useAuth();
 async function getAdminEmails(): Promise<string[]> {
  try {
    const { users } = await userService.getAllUsers(1, 100); 
    const admins = users.filter((user) => user.role === 'ADMIN' && !user.blocked);
    return admins.map((admin) => admin.email);
  } catch (error) {
    console.error('Failed to fetch admin emails:', error);
    return [];
  }
}

  const handleSubmit = async () => {
		 const adminEmails = await getAdminEmails();
    const ticket = {
      reportedBy: user?.email,
      template: document.title || 'N/A',
      link: window.location.href,
      summary,
      priority,
      admins: adminEmails
    };

    await uploadSupportTicket(ticket);
    handleClose();
    alert('Support ticket submitted!');
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Submit Support Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="summary">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="priority">
            <Form.Label className="mt-3">Priority</Form.Label>
            <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>High</option>
              <option>Average</option>
              <option>Low</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit Ticket</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupportModal;
