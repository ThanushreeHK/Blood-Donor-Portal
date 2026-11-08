import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function HospitalDashboard() {
  const { user } = useAuth();

  return (
    <div className="d-flex">
      <Sidebar role="hospital" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Hospital Dashboard</h2>
        
        <div className="alert alert-warning mb-4">
          <strong>Verification Pending:</strong> Your hospital account is currently under review by the Admin. You will be able to receive public requests once verified.
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-4 text-center h-100">
              <h5 className="text-muted">Blood Units Available</h5>
              <h1 className="display-4 fw-bold text-danger">0</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-4 text-center h-100">
              <h5 className="text-muted">Pending Requests</h5>
              <h1 className="display-4 fw-bold text-dark">0</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-4 text-center h-100">
              <h5 className="text-muted">Donors Matched</h5>
              <h1 className="display-4 fw-bold text-success">0</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}