import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

type User = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type HeaderProps = {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export const Header = ({ user, onSignIn, onSignOut }: HeaderProps) => {

	const [showProfileModal, setShowProfileModal] = useState(false);
  // Generate initials-based avatar if no image URL provided
  const getAvatar = () => {
    if (user?.avatarUrl) return user.avatarUrl;
    const initials = user?.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&size=32`;
  };

  return (
   <>
	  <nav className="navbar bg-body-tertiary navbar-expand-lg">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img
            src="/docs/5.3/assets/brand/bootstrap-logo.svg"
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top me-2"
          />
          <span className="">Form</span>
        </a>

        {/* Search bar */}
        <div className="d-flex flex-grow-1 mx-4" style={{ maxWidth: '600px' }}>
          <form className="d-flex w-100" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search templates..."
              aria-label="Search"
            />
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </form>
        </div>

        {/* Navigation items */}
        <ul className="navbar-nav">

          {/* Conditional: Avatar or Sign In */}
          {user ? (
            <li className="nav-item">
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
            </li>
          ) : (
            <li className="nav-item">
              <button className="btn btn-primary ms-2" onClick={onSignIn}>
                Sign In
              </button>
            </li>
          )}
        </ul>
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
            <Button variant="danger" onClick={onSignOut}>
              Sign Out
            </Button>
          </Modal.Footer>
        </Modal>
      )}
	 </>
  );
};
