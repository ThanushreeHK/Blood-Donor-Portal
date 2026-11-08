import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="d-flex">
      <Sidebar role="patient" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Welcome, {user.name}</h2>
        
        <div className="card shadow-sm border-0 bg-danger text-white p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold mb-1">Need Blood Urgently?</h4>
              <p className="mb-0 opacity-75">Create a request to instantly notify compatible donors in your city.</p>
            </div>
            <Link to="/patient/request" className="btn btn-light text-danger fw-bold px-4 py-2">
              Create Request
            </Link>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100 p-4 text-center">
              <h5 className="text-muted">Active Requests</h5>
              <h1 className="display-4 fw-bold text-dark">0</h1>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100 p-4 text-center">
              <h5 className="text-muted">Fulfilled Requests</h5>
              <h1 className="display-4 fw-bold text-success">0</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}