import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/Data/getalerts`, {
        method: "POST",
        credentials: "include"
      });

      const data = response.ok ? await response.json() : [];
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading alerts:", error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  function getBadgeClass(type) {
    if (type === "CRITICAL") return "bg-danger-subtle text-danger";
    if (type === "WARNING") return "bg-warning-subtle text-warning";
    return "bg-success-subtle text-success";
  }

  function getIcon(type) {
    if (type === "CRITICAL") return "🚨";
    if (type === "WARNING") return "⚠️";
    return "✅";
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold">Alerts</h3>
        <p className="text-muted mb-0">SMS and system-generated environmental alerts</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-3 text-muted">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No alerts found
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div key={index} className="mb-3 border-bottom pb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">
                      {getIcon(alert.type)} {alert.message}
                    </div>
                    <div className="text-muted small mt-1">
                      {alert.source} • {alert.timestamp}
                    </div>
                  </div>
                  <span className={`badge ${getBadgeClass(alert.type)}`}>
                    {alert.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Alerts;
