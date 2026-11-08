import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'donor', consent: true,
    hospitalName: '', licenseNumber: '', city: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success('Account created successfully!');

      if (user.role === 'donor') {
        await api.post('/donors', {
          name: formData.name, 
          bloodGroup: 'O+', 
          city: formData.city || 'Davanagere', 
          state: 'Karnataka',
          area: 'Center', 
          dob: '1990-01-01',
          phone: formData.phone, 
          consent: true
        });
        toast.success('Donor profile initialized!');
        navigate('/donor/dashboard');
      } 
      else if (user.role === 'hospital') {
        await api.post('/hospitals', {
          hospitalName: formData.hospitalName,
          licenseNumber: formData.licenseNumber,
          city: formData.city,
          address: formData.address,
          contactPerson: formData.name,
          phone: formData.phone
        });
        toast.success('Hospital profile initialized!');
        navigate('/hospital/dashboard');
      }
      else {
        navigate('/patient/dashboard');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4 fw-bold" style={{ color: 'var(--primary)' }}>Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold">I am registering as a:</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="role" value="donor" checked={formData.role === 'donor'} onChange={handleChange} />
                <label className="form-check-label">Blood Donor</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="role" value="patient" checked={formData.role === 'patient'} onChange={handleChange} />
                <label className="form-check-label">Patient</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="role" value="hospital" checked={formData.role === 'hospital'} onChange={handleChange} />
                <label className="form-check-label">Hospital</label>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">{formData.role === 'hospital' ? 'Contact Person Name' : 'Full Name'}</label>
              <input type="text" name="name" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" className="form-control" onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required minLength="6" />
          </div>

          {/* Conditional Fields for Hospitals */}
          {formData.role === 'hospital' && (
            <div className="bg-light p-3 rounded mb-3 border">
              <h6 className="mb-3 text-danger">Hospital Details</h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Hospital Name</label>
                  <input type="text" name="hospitalName" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">License Number</label>
                  <input type="text" name="licenseNumber" className="form-control" onChange={handleChange} required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <select name="city" className="form-select" onChange={handleChange} required>
                    <option value="">Select City...</option>
                    <option value="Davanagere">Davanagere</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Mangaluru">Mangaluru</option>
                    <option value="Hubballi">Hubballi</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label">Full Address</label>
                  <input type="text" name="address" className="form-control" onChange={handleChange} required />
                </div>
              </div>
            </div>
          )}

          <div className="form-check mb-4">
            <input className="form-check-input" type="checkbox" required defaultChecked />
            <label className="form-check-label small text-muted">I agree to the terms and conditions.</label>
          </div>

          <button type="submit" className="btn btn-blood w-100 mb-3" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-muted small mb-0">
          Already have an account? <Link to="/login" className="text-danger">Login here</Link>
        </p>
      </div>
    </div>
  );
}