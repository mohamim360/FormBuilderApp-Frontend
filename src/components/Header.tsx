// src/components/Header.tsx
import { useState } from "react";
import { Button, Form, Modal, Nav, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthService } from "../services/authService";
import { FaHome } from "react-icons/fa";



export const Header = () => {
  const { user, loading, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = () => {
    AuthService.logout();
    logout();
    setShowProfileModal(false);
    navigate('/login');
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  // Generate initials-based avatar if no image URL provided
  const getAvatar = () => {
    if (!user) return '';
    if (user.avatarUrl) return user.avatarUrl;
    const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&size=32`;
  };

  if (loading) {
    return (
      <nav className="navbar bg-body-tertiary navbar-expand-lg">
        <div className="container-fluid justify-content-end">
          <Spinner animation="border" role="status" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar bg-body-tertiary navbar-expand-lg">
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand" to="/">

            <span className="">FormBuilder</span>
          </Link>

          {/* Search bar */}
          <div className="d-flex flex-grow-1 mx-4" style={{ maxWidth: '600px' }}>
            <Form className="d-flex w-100" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search templates..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-primary" type="submit">
                Search
              </Button>
            </Form>
          </div>

          {/* Navigation items */}
          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Item className="me-3 ">
 <Link to="/dashboard" className="nav-link">
                    <FaHome className="me-1 mb-1" />
                    User Dashboard
                  </Link>

                </Nav.Item>
                <Nav.Item>
                  <button
                    className="nav-link d-flex align-items-center bg-transparent border-0"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <img
                      src={getAvatar()}
                      alt="avatar"
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                    />
                    <span className="d-none d-lg-inline">{user.name}</span>
                  </button>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <Link to="/login" className="btn btn-primary ms-2">
                  Log In
                </Link>
              </Nav.Item>
            )}
          </Nav>

        </div>
      </nav>

      {/* Profile Modal */}
      {user && (
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img
              src={getAvatar()}
              alt="avatar"
              className="rounded-circle mb-3"
              width="80"
              height="80"
            />
            <h5>{user.name}</h5>
            <p className="text-muted">{user.email}</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};