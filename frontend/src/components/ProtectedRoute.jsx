import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <a href="/" className="btn btn-blood mt-3">Go Home</a>
      </div>
    );
  }

  return children;
}