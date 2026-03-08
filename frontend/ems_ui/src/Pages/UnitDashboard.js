import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UnitDashboard() {
  const { id } = useParams();
  const [unitproperties, setUnitproperties] = useState([]);  // Always array
  const [propertydata, setPropertydata] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load unit properties and measurements
  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        setLoading(true);
        
        // Get unit properties
        const propertiesRes = await fetch("http://localhost:5000/Data/getunitproperties", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UnitId: id })
        });
        let propertiesData = [];
        if (propertiesRes.ok) {
          propertiesData = await propertiesRes.json();
          // Ensure it's an array
          if (!Array.isArray(propertiesData)) {
            propertiesData = [];
          }
        }
        setUnitproperties(propertiesData);
        console.log("Properties:", propertiesData);

        // Get measurements only if properties exist
        if (propertiesData.length > 0) {
          const propertyIds = propertiesData.map(prop => prop.id || prop.propertyId);
          const measurementsRes = await fetch("http://localhost:5000/Data/getmeasurements", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, propertyIds })
          });
          let measurementsData = [];
          if (measurementsRes.ok) {
            measurementsData = await measurementsRes.json();
            if (!Array.isArray(measurementsData)) {
              measurementsData = [];
            }
          }
          setMeasurements(measurementsData);
          console.log("Measurements:", measurementsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setUnitproperties([]);  // Ensure empty array on error
        setMeasurements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [id]);

  // Rest of your functions (getProperties, addProperty, sendDummyData) remain same...
  const getProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/Data/getproperties", {
        method: "POST",
        credentials: "include"
      });
      let data = [];
      if (res.ok) {
        data = await res.json();
        if (!Array.isArray(data)) data = [];
      }
      setPropertydata(data);
      setShow(true);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const addProperty = async (PId) => {
    try {
      await fetch("http://localhost:5000/Data/addunitproperty", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid: PId, uid: id })
      });
      setShow(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const sendDummyData = async () => {
    try {
      await fetch("http://localhost:5000/Data/sendunitdata", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 1,
          Vals: { 1: 20.2, 2: 33.3,3: 67.89,4: 12.34 },
          TId: 220
        })
      });
      alert("Dummy data sent!");
    } catch (error) {
      console.error("Error sending dummy data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-semibold mb-1">Unit Dashboard</h4>
              <small className="text-muted">Unit ID: {id}</small>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-success" onClick={sendDummyData}>
                🔄 Send Dummy Data
              </button>
              <button className="btn btn-success" onClick={getProperties}>
                ➕ Add Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties & Measurements Cards */}
      <div className="row g-4">
        {unitproperties.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-satellite fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">No properties configured</h6>
              <p className="text-muted">Click "Add Property" to configure sensors</p>
            </div>
          </div>
        ) : (
          unitproperties.map((unitproperty, index) => {
            const latestMeasurement = measurements
              .filter(m => 
                (m.propertyId == unitproperty.propertyId) || 
                (m.propertyId == unitproperty.id)
              )
              .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))[0];

            return (
              <div className="col-md-6 col-lg-4" key={unitproperty.propertyId || unitproperty.id || index}>
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0 fw-semibold">{unitproperty.propertyName}</h6>
                  </div>
                  <div className="card-body">
                    {latestMeasurement ? (
                      <>
                        <div className="display-5 fw-bold text-primary mb-2">
                          {latestMeasurement.value}
                        </div>
                        <small className="text-muted">
                          Updated {latestMeasurement.timestamp || "just now"}
                        </small>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <span className="text-muted">No data yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Property Modal - same as before */}
      {show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Property to Unit</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShow(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {propertydata.map((property, index) => (
                    <div 
                      className="col-md-6 col-lg-4"
                      key={property.propertyId || index}
                      onClick={() => addProperty(property.propertyId)}
                    >
                      <div className="card border-0 shadow-sm h-100 cursor-pointer hover-card">
                        <div className="card-body text-center p-3">
                          <h6 className="fw-semibold mb-1">{property.propertyName}</h6>
                          <small className="text-muted">{property.propertyDescription}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitDashboard;
