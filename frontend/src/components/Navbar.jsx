import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'donor') return '/donor/dashboard';
    if (user.role === 'patient') return '/patient/dashboard';
    return '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-danger" to="/">
          🩸 BloodLink
        </Link>
        
        <div className="d-flex align-items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline-danger btn-sm">Login</Link>
              <Link to="/register" className="btn btn-blood btn-sm">Register</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardLink()} className="text-decoration-none text-dark fw-bold">
                Hello, {user.name} <span className="badge bg-danger ms-1">{user.role}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm ms-3">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}