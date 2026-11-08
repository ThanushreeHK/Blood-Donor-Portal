import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function TrackRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await api.get('/requests');
        setRequests(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    // Fetch immediately on load
    fetchRequests();

    // Then, fetch again every 10 seconds to simulate real-time updates!
    const interval = setInterval(fetchRequests, 10000);
    
    // Cleanup the interval if the user leaves the page
    return () => clearInterval(interval);
  }, []);

  // Helper to format the Firestore timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    // Firestore timestamps have _seconds. If it's a string, it's already formatted.
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="d-flex">
      <Sidebar role="patient" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Track Your Requests</h2>
        
        {loading ? (
          <div className="spinner-border text-danger" role="status"></div>
        ) : requests.length === 0 ? (
          <div className="alert alert-info">You have not created any blood requests yet.</div>
        ) : (
          <div className="row g-3">
            {requests.map(req => (
              <div className="col-md-6" key={req.id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="mb-0 fw-bold text-danger">{req.bloodGroup}</h4>
                      <span className={`badge ${req.status === 'matched' ? 'bg-success' : req.status === 'fulfilled' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="mb-1"><strong>Patient:</strong> {req.patientName}</p>
                    <p className="mb-1"><strong>Hospital:</strong> {req.hospital}</p>
                    <p className="mb-1"><strong>City:</strong> {req.city}</p>
                    <p className="mb-3"><strong>Urgency:</strong> <span className="text-danger fw-bold">{req.urgency.toUpperCase()}</span></p>
                    
                    {/* DONOR CONTACT REVEAL SECTION */}
                    {req.status === 'matched' && req.donorContact && (
                      <div className="alert alert-success mt-auto mb-3 p-3">
                        <h6 className="fw-bold mb-2">🎉 Donor Found!</h6>
                        <p className="mb-1"><strong>Name:</strong> {req.donorContact.name}</p>
                        <p className="mb-1">
                          <strong>Phone:</strong> <a href={`tel:${req.donorContact.phone}`} className="text-decoration-none">{req.donorContact.phone}</a>
                        </p>
                        <p className="mb-0">
                          <strong>Email:</strong> <a href={`mailto:${req.donorContact.email}`} className="text-decoration-none">{req.donorContact.email}</a>
                        </p>
                      </div>
                    )}

                    <p className="text-muted small mb-0 mt-auto border-top pt-2">
                      Requested on: {formatDate(req.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}