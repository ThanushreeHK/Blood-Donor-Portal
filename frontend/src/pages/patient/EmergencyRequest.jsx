import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function EmergencyRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '', bloodGroup: 'A+', units: 1, hospital: '', city: '', urgency: 'critical',
    contactName: '', contactPhone: '', notes: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/requests', formData);
      setSuccessData(res.data.data);
      toast.success("Request created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="container mt-5 text-center">
        <div className="card shadow-sm p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h2 className="text-success mb-3">✅ Request Created!</h2>
          <p className="fs-5">We have found and emailed <strong>{successData.matchedCount}</strong> compatible donors.</p>
          <p className="text-muted">You will be notified as soon as a donor accepts your request.</p>
          <button className="btn btn-blood mt-4" onClick={() => navigate('/patient/track')}>Track Your Request</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '800px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-danger text-white p-4">
          <h3 className="mb-0 fw-bold">🚨 Create Emergency Request</h3>
          <p className="mb-0 opacity-75">Fill this out to instantly notify compatible donors.</p>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <h5 className="mb-3 text-muted">Patient Details</h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Patient Name</label>
                <input type="text" name="patientName" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Blood Group</label>
                <select name="bloodGroup" className="form-select" onChange={handleChange} value={formData.bloodGroup}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Units Needed</label>
                <input type="number" name="units" min="1" max="5" className="form-control" onChange={handleChange} value={formData.units} required />
              </div>
            </div>

            <h5 className="mb-3 mt-4 text-muted">Hospital & Location</h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Hospital Name</label>
                <input type="text" name="hospital" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">City (District)</label>
                <select name="city" className="form-select" onChange={handleChange} value={formData.city} required>
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
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Urgency Level</label>
                <select name="urgency" className="form-select" onChange={handleChange} value={formData.urgency}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Contact Name</label>
                <input type="text" name="contactName" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Contact Phone</label>
                <input type="text" name="contactPhone" className="form-control" onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Additional Notes (Optional)</label>
              <textarea name="notes" className="form-control" rows="2" onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn btn-blood w-100 py-2 fs-5" disabled={loading}>
              {loading ? 'Notifying Donors...' : 'Notify Donors Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}