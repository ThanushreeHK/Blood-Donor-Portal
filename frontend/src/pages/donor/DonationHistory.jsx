import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function DonationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get('/donors/me/history');
        setHistory(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'Recently';
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="d-flex">
      <Sidebar role="donor" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Donation History</h2>

        {loading ? (
          <div className="spinner-border text-danger"></div>
        ) : history.length === 0 ? (
          <div className="alert alert-info">You haven't made any donations yet.</div>
        ) : (
          <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '800px' }}>
            <h4 className="mb-4">Total Donations: <span className="text-danger">{history.length}</span></h4>
            
            <div className="timeline">
              {history.map((item, index) => (
                <div key={item.id} className="mb-4 pb-4 border-bottom position-relative">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold mb-1">🩸 Blood Donated</h5>
                    <span className="badge bg-success">{item.status.toUpperCase()}</span>
                  </div>
                  <p className="text-muted mb-1">Hospital: {item.hospitalId}</p>
                  <p className="mb-0"><small className="text-muted">Date: {formatDate(item.donatedAt)}</small></p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}