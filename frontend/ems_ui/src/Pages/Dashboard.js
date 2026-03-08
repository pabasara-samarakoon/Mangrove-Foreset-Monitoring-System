import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Move metricCard OUTSIDE component
const metricCard = (title, icon, value, unit, statusText, statusVariant, timeText) => (
  <div className="col-md-6 col-lg-3 mb-3" key={title}>
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-semibold">{title}</h6>
          <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        </div>
        <h3 className="fw-bold">
          {value} <small className="text-muted" style={{ fontSize: "0.85rem" }}>{unit}</small>
        </h3>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span
            className={`badge rounded-pill bg-${statusVariant}`}
            style={{ fontSize: "0.75rem" }}
          >
            {statusText}
          </span>
          <small className="text-muted">{timeText}</small>
        </div>
      </div>
    </div>
  </div>
);

function Dashboard() {
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //need to change http://localhost:5000 part to aglobal string variable in the every pages
    fetch("http://localhost:5000/Data/getunits", {
      method: "POST",
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setUnits(data);
        console.log(data);
      })
      .catch(err => console.error("Error fetching units:", err));
  }, []);

  function gotounit(unitId) {
    navigate(`/unitdashboard/${unitId}`);
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row mb-4">
        <div className="col">
          <h4 className="fw-semibold mb-0">Environmental Monitoring System</h4>
          <small className="text-muted">Real-time sensor data and SMS alerts</small>
        </div>
      </div>

      {/* Units List - Improved styling */}
      <div className="row mb-4">
        <div className="col-12">
          <h6 className="fw-semibold mb-3">Sensor Units</h6>
          {units.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Loading units...</p>
            </div>
          ) : (
            <div className="row">
              {units.map(unit => (
                <div 
                  className="col-md-6 col-lg-4 mb-3"
                  key={unit.unitId}
                  onClick={() => gotounit(unit.unitId)}
                >
                  <div className="card shadow-sm h-100 border-0 cursor-pointer hover-card">
                    <div className="card-body p-3">
                      <h6 className="fw-bold text-primary mb-1">{unit.unitName}</h6>
                      <p className="text-muted mb-2 small">{unit.location}</p>
                      <p className="text-secondary small mb-0">{unit.unitDescription}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
{/*
      {/* Metric cards 
      <div className="row">
        {metricCard("Temperature", "🌡️", "35.2", "°C", "Critical", "danger-subtle text-danger", "2 mins ago")}
        {metricCard("Humidity", "💧", "62.5", "%", "Normal", "success-subtle text-success", "2 mins ago")}
        {metricCard("Air Quality Index", "💨", "145", "AQI", "Warning", "warning-subtle text-warning", "5 mins ago")}
        {metricCard("CO2 Level", "📈", "485", "ppm", "Normal", "success-subtle text-success", "3 mins ago")}
      </div>

      {/* Rest of your dashboard content (tabs, chart, SMS alerts) stays the same *
      <div className="row mt-4">
        {/* ... your existing tabs/chart/SMS code ... *
        <div className="col-lg-8 mb-4">
          <ul className="nav nav-pills mb-3">
            <li className="nav-item">
              <button className="nav-link">Temperature</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Humidity</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Air Quality</button>
            </li>
            <li className="nav-item">
              <button className="nav-link active">CO2</button>
            </li>
          </ul>
          
        </div>
      </div>
*/}
    </div>
  );
}

export default Dashboard;
