import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      const res = await api.get('/admin/hospitals');
      setHospitals(res.data.data);
    } catch (error) {
      toast.error("Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleVerify = async (id) => {
    try {
      const res = await api.patch(`/admin/hospitals/${id}/verify`);
      toast.success(res.data.message);
      fetchHospitals(); // Refresh list
    } catch (error) {
      toast.error("Failed to verify");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Manage Hospitals</h2>

        {loading ? <div className="spinner-border text-danger"></div> : (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Hospital Name</th>
                    <th>City</th>
                    <th>License</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map(h => (
                    <tr key={h.id}>
                      <td className="fw-bold">{h.hospitalName}</td>
                      <td>{h.city}</td>
                      <td>{h.licenseNumber}</td>
                      <td>
                        <span className={`badge ${h.verified ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {h.verified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`btn btn-sm ${h.verified ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => handleVerify(h.id)}
                        >
                          {h.verified ? 'Unverify' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}