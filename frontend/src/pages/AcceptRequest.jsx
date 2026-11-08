import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function AcceptRequest() {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing your response...');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processRequest = async () => {
      // 1. Get the token from the URL (?token=xyz)
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No token provided in the link.');
        return;
      }

      // 2. Determine if this is an accept or decline link based on the URL path
      const isAccept = location.pathname.includes('accept');
      const endpoint = isAccept ? '/requests/accept' : '/requests/decline';

      try {
        // 3. Send the request to the backend
        const res = await api.post(endpoint, { token });
        setStatus('success');
        setMessage(res.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Invalid or expired link.');
      }
    };

    processRequest();
  }, [location]);

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-sm p-5 mx-auto" style={{ maxWidth: '500px' }}>
        
        {status === 'processing' && (
          <>
            <div className="spinner-border text-danger mb-3" role="status"></div>
            <h4>{message}</h4>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-success display-1 mb-3">✅</div>
            <h3 className="fw-bold">Response Recorded!</h3>
            <p className="text-muted fs-5">{message}</p>
            <Link to="/" className="btn btn-blood mt-3">Go to Homepage</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-danger display-1 mb-3">❌</div>
            <h3 className="fw-bold">Oops!</h3>
            <p className="text-muted fs-5">{message}</p>
            <Link to="/" className="btn btn-outline-danger mt-3">Go to Homepage</Link>
          </>
        )}

      </div>
    </div>
  );
}