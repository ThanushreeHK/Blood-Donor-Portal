import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (error) {
        toast.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading Admin Data...</div>;

  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Admin Dashboard</h2>
        
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-4 text-center bg-primary text-white h-100">
              <h5 className="opacity-75">Total Donors</h5>
              <h1 className="display-4 fw-bold mb-0">{stats.totalDonors}</h1>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-4 text-center bg-info text-white h-100">
              <h5 className="opacity-75">Total Patients</h5>
              <h1 className="display-4 fw-bold mb-0">{stats.totalPatients}</h1>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-4 text-center bg-success text-white h-100">
              <h5 className="opacity-75">Verified Hospitals</h5>
              <h1 className="display-4 fw-bold mb-0">{stats.verifiedHospitals} <span className="fs-5">/ {stats.totalHospitals}</span></h1>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-4 text-center bg-danger text-white h-100">
              <h5 className="opacity-75">Pending Requests</h5>
              <h1 className="display-4 fw-bold mb-0">{stats.pendingRequests}</h1>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-5">
                <h4 className="fw-bold mb-3">Hospital Verification</h4>
                <p className="text-muted mb-4">Review and verify hospitals so they can post requests and manage inventory.</p>
                <Link to="/admin/hospitals" className="btn btn-blood px-4 py-2">Manage Hospitals</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-5">
                <h4 className="fw-bold mb-3">User Management</h4>
                <p className="text-muted mb-4">View all registered donors, patients, and hospital accounts.</p>
                <Link to="/admin/users" className="btn btn-outline-danger px-4 py-2">Manage Users</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}