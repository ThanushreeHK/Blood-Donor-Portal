import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTint } from 'react-icons/fa';

export default function BloodInventory() {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory/me');
      setInventory(res.data.data);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (bloodGroup, newUnits) => {
    setUpdating(true);
    try {
      const res = await api.put('/inventory/me', { bloodGroup, units: newUnits });
      setInventory(res.data.data);
      toast.success(`${bloodGroup} updated to ${newUnits} units`);
    } catch (error) {
      toast.error("Failed to update inventory");
    } finally {
      setUpdating(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="d-flex">
      <Sidebar role="hospital" />
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Blood Inventory</h2>
        <p className="text-muted">Manage the available blood units in your facility.</p>

        {loading ? (
          <div className="spinner-border text-danger"></div>
        ) : (
          <div className="row g-4">
            {bloodGroups.map(bg => {
              const units = inventory[bg] || 0;
              // Highlight in red if stock is low (under 5 units)
              const isLowStock = units < 5; 

              return (
                <div className="col-md-6 col-lg-3" key={bg}>
                  <div className={`card shadow-sm border-0 h-100 ${isLowStock ? 'border-danger border-2' : ''}`}>
                    <div className="card-body text-center p-4">
                      <h1 className={`display-5 fw-bold ${isLowStock ? 'text-danger' : 'text-dark'}`}>
                        {units}
                      </h1>
                      <div className={`badge mb-3 fs-6 ${isLowStock ? 'bg-danger' : 'bg-secondary'}`}>
                        <FaTint className="me-1" /> {bg}
                      </div>
                      {isLowStock && <p className="text-danger small mb-2 fw-bold">LOW STOCK</p>}
                      
                      <div className="input-group mt-3">
                        <input 
                          type="number" 
                          className="form-control" 
                          min="0"
                          id={`input-${bg}`}
                          defaultValue={units}
                        />
                        <button 
                          className="btn btn-outline-danger" 
                          disabled={updating}
                          onClick={() => {
                            const val = document.getElementById(`input-${bg}`).value;
                            handleUpdate(bg, val);
                          }}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}