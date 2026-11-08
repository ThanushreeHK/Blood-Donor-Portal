import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch donor profile on load
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/donors/me');
        setProfile(res.data.data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await api.patch('/donors/me/availability');
      setProfile({ ...profile, isAvailable: res.data.data.isAvailable });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to toggle availability");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;
  if (!profile) return (
    <div className="container mt-5 text-center">
      <div className="alert alert-warning">
        <h4>Donor Profile Not Found</h4>
        <p>It looks like you haven't completed your donor registration.</p>
        <a href="/register" className="btn btn-blood">Register as Donor</a>
      </div>
    </div>
  );

  return (
    <div className="d-flex">
      <Sidebar role="donor" />
      <div className="container-fluid p-4">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">Hello, {user.name} 👋</h2>
            <p className="text-muted">Thank you for being a hero in our community.</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Availability Card */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Your Availability</h5>
                <p className="card-text text-muted">Toggle this off if you are temporarily unable to donate.</p>
                <div className="form-check form-switch fs-5">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={profile.isAvailable} 
                    onChange={toggleAvailability} 
                  />
                  <label className={`form-check-label fw-bold ms-2 ${profile.isAvailable ? 'text-success' : 'text-danger'}`}>
                    {profile.isAvailable ? 'Available to Donate' : 'Not Available'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Group Info Card */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100 bg-danger text-white">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h5 className="card-title text-uppercase small fw-bold opacity-75">Your Blood Group</h5>
                <h1 className="display-1 fw-bold mb-0">{profile.bloodGroup}</h1>
                <p className="mb-0">{profile.city}, {profile.area}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}