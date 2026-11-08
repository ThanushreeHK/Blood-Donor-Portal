import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import DonationHistory from './pages/donor/DonationHistory';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import EmergencyRequest from './pages/patient/EmergencyRequest';
import TrackRequest from './pages/patient/TrackRequest';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import BloodInventory from './pages/hospital/BloodInventory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHospitals from './pages/admin/ManageHospitals';

// Shared Pages
import AcceptRequest from './pages/AcceptRequest';

// Public Placeholder
const Home = () => (
  <div className="text-center mt-5">
    <h1 className="fw-bold" style={{ color: 'var(--primary)' }}>Welcome to BloodLink</h1>
    <p className="fs-5 text-muted">Every Drop Counts.</p>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Token-based Public Routes (from Email) */}
        <Route path="/accept-request" element={<AcceptRequest />} />
        <Route path="/decline-request" element={<AcceptRequest />} />
        
        {/* Donor Routes (Protected) */}
        <Route 
          path="/donor/dashboard" 
          element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/donor/profile" 
          element={<ProtectedRoute allowedRoles={['donor']}><DonorProfile /></ProtectedRoute>} 
        />
        <Route 
          path="/donor/history" 
          element={<ProtectedRoute allowedRoles={['donor']}><DonationHistory /></ProtectedRoute>} 
        />
        
        {/* Patient Routes (Protected) */}
        <Route 
          path="/patient/dashboard" 
          element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/patient/request" 
          element={<ProtectedRoute allowedRoles={['patient']}><EmergencyRequest /></ProtectedRoute>} 
        />
        <Route 
          path="/patient/track" 
          element={<ProtectedRoute allowedRoles={['patient']}><TrackRequest /></ProtectedRoute>} 
        />

        {/* Hospital Routes (Protected) */}
        <Route 
          path="/hospital/dashboard" 
          element={<ProtectedRoute allowedRoles={['hospital']}><HospitalDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/hospital/inventory" 
          element={<ProtectedRoute allowedRoles={['hospital']}><BloodInventory /></ProtectedRoute>} 
        />

        {/* Admin Routes (Protected) */}
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/hospitals" 
          element={<ProtectedRoute allowedRoles={['admin']}><ManageHospitals /></ProtectedRoute>} 
        />
      </Routes>
    </>
  );
}

export default App;