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
            <li className="nav-item dropdown">
              <a
                className="nav-link d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={getAvatar()}
                  alt="avatar"
                  className="rounded-circle me-2"
                  width="32"
                  height="32"
                />
                <span className="d-none d-lg-inline">{user.name}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={onSignOut}>
                    Sign Out
                  </button>
                </li>
              </ul>
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
  );
};
