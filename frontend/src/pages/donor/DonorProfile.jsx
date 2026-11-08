import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function DonorProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', bloodGroup: 'O+', dob: '', city: '', state: 'Karnataka', area: '', phone: '', consent: true
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/donors/me');
        setFormData({
          name: res.data.data.name || '',
          bloodGroup: res.data.data.bloodGroup || 'O+',
          dob: res.data.data.dob || '',
          city: res.data.data.city || '',
          state: res.data.data.state || 'Karnataka',
          area: res.data.data.area || '',
          phone: res.data.data.phone || '',
          consent: res.data.data.consent ?? true
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/donors/me', formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;

  return (
    <div className="d-flex">
      <Sidebar role="donor" />
      <div className="container-fluid p-4" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold mb-4">My Profile</h2>

        <div className="alert alert-info d-flex align-items-center mb-4">
          <span className="fs-4 me-3">🔒</span>
          <div><strong>Privacy Note:</strong> Your contact information is shared ONLY when you click "Accept" on a blood request.</div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email (Read-Only)</label>
                  <input type="email" className="form-control" value={user.email} disabled />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Blood Group</label>
                  <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <select name="city" className="form-select" value={formData.city} onChange={handleChange} required>
                    <option value="">Select City...</option>
                    <option value="Davanagere">Davanagere</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Mangaluru">Mangaluru</option>
                    <option value="Hubballi">Hubballi</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Shivamogga">Shivamogga</option>
                    <option value="Tumakuru">Tumakuru</option>
                    <option value="Ballari">Ballari</option>
                    <option value="Vijayapura">Vijayapura</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <input type="text" name="state" className="form-control" value={formData.state} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Area / Locality</label>
                  <input type="text" name="area" className="form-control" value={formData.area} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} id="consentCheck" />
                <label className="form-check-label" htmlFor="consentCheck">I consent to be contacted for blood donation requests.</label>
              </div>

              <button type="submit" className="btn btn-blood px-5 py-2" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}