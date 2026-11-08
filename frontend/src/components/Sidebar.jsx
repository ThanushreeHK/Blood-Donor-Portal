import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaTint, 
  FaHistory, 
  FaPlusCircle, 
  FaClipboardList,
  FaHospital
} from 'react-icons/fa';

export default function Sidebar({ role }) {
  const menus = {
    donor: [
      { path: '/donor/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
      { path: '/donor/profile', name: 'My Profile', icon: <FaUser /> },
      { path: '/donor/history', name: 'Donation History', icon: <FaHistory /> },
    ],
    patient: [
      { path: '/patient/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
      { path: '/patient/request', name: 'Emergency Request', icon: <FaPlusCircle /> },
      { path: '/patient/track', name: 'Track Requests', icon: <FaClipboardList /> },
    ],
    hospital: [
      { path: '/hospital/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
      { path: '/hospital/inventory', name: 'Blood Inventory', icon: <FaTint /> },
    ],
    admin: [
      { path: '/admin/dashboard', name: 'Admin Dashboard', icon: <FaTachometerAlt /> },
      { path: '/admin/hospitals', name: 'Manage Hospitals', icon: <FaHospital /> },
    ]
  };

  const currentMenu = menus[role] || [];

  return (
    <div className="bg-white shadow-sm p-3 d-flex flex-column" style={{ width: '250px', minHeight: 'calc(100vh - 70px)', borderRight: '1px solid #e0e0e0' }}>
      <h5 className="text-muted mb-4 text-uppercase small fw-bold tracking-wide">Menu</h5>
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        {currentMenu.map((item) => (
          <li className="nav-item" key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center gap-2 ${isActive ? 'active bg-danger text-white fw-bold' : 'text-dark'}`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}