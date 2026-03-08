import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "http://localhost:5000";

const metricInfo = {
  Temperature: { icon: "🌡️", unit: "°C" },
  Humidity: { icon: "💧", unit: "%" },
  "Air Quality Index": { icon: "💨", unit: "AQI" },
  CO2: { icon: "📈", unit: "ppm" }
};

const metricCard = (title, icon, value, unit, statusText, badgeClass, timeText) => (
  <div className="col-md-6 col-lg-3 mb-3" key={title}>
    <div className="card shadow-sm h-100 border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-semibold">{title}</h6>
          <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        </div>
        <h3 className="fw-bold">
          {value} <small className="text-muted" style={{ fontSize: "0.85rem" }}>{unit}</small>
        </h3>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className={`badge rounded-pill ${badgeClass}`} style={{ fontSize: "0.75rem" }}>
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
  const [allData, setAllData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("CO2");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      const unitsRes = await fetch(`${API_BASE_URL}/Data/getunits`, {
        method: "POST",
        credentials: "include"
      });
      const unitsData = unitsRes.ok ? await unitsRes.json() : [];
      setUnits(Array.isArray(unitsData) ? unitsData : []);

      const dataRes = await fetch(`${API_BASE_URL}/Data/getalldashboarddata`, {
        method: "POST",
        credentials: "include"
      });
      const dashboardData = dataRes.ok ? await dataRes.json() : [];
      const validData = Array.isArray(dashboardData) ? dashboardData : [];
      setAllData(validData);

      const generatedAlerts = buildAlerts(validData);
      setAlerts(generatedAlerts);
    } catch (error) {
      console.error("Dashboard load error:", error);
      setUnits([]);
      setAllData([]);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  function gotounit(unitId) {
    navigate(`/unitdashboard/${unitId}`);
  }

  function getMetricStatus(metric, value) {
    const num = Number(value);

    if (metric === "Temperature") {
      if (num >= 35) return { text: "Critical", badge: "bg-danger-subtle text-danger" };
      if (num >= 30) return { text: "Warning", badge: "bg-warning-subtle text-warning" };
      return { text: "Normal", badge: "bg-success-subtle text-success" };
    }

    if (metric === "Humidity") {
      if (num < 40) return { text: "Warning", badge: "bg-warning-subtle text-warning" };
      return { text: "Normal", badge: "bg-success-subtle text-success" };
    }

    if (metric === "Air Quality Index") {
      if (num >= 150) return { text: "Critical", badge: "bg-danger-subtle text-danger" };
      if (num >= 100) return { text: "Warning", badge: "bg-warning-subtle text-warning" };
      return { text: "Normal", badge: "bg-success-subtle text-success" };
    }

    if (metric === "CO2") {
      if (num >= 1000) return { text: "Critical", badge: "bg-danger-subtle text-danger" };
      if (num >= 700) return { text: "Warning", badge: "bg-warning-subtle text-warning" };
      return { text: "Normal", badge: "bg-success-subtle text-success" };
    }

    return { text: "Normal", badge: "bg-success-subtle text-success" };
  }

  function buildAlerts(data) {
    const result = [];

    data.forEach(item => {
      const metric = item.propertyName?.trim();
      const value = Number(item.value);
      const unitName = item.unitName || `Unit ${item.unitId}`;
      const time = item.timestamp || "just now";

      if (metric === "Temperature" && value >= 35) {
        result.push({
          type: "CRITICAL",
          badge: "bg-danger-subtle text-danger",
          icon: "⚠️",
          message: `Temperature exceeded threshold: ${value}°C detected`,
          source: `${unitName} • ${time}`
        });
      } else if (metric === "Humidity" && value < 40) {
        result.push({
          type: "WARNING",
          badge: "bg-warning-subtle text-warning",
          icon: "⚠️",
          message: `Humidity dropped below safe range: ${value}%`,
          source: `${unitName} • ${time}`
        });
      } else if (metric === "Air Quality Index" && value >= 100) {
        result.push({
          type: value >= 150 ? "CRITICAL" : "WARNING",
          badge: value >= 150 ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning",
          icon: "⚠️",
          message: `Air quality index is elevated: ${value} AQI`,
          source: `${unitName} • ${time}`
        });
      } else if (metric === "CO2" && value >= 700) {
        result.push({
          type: value >= 1000 ? "CRITICAL" : "WARNING",
          badge: value >= 1000 ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning",
          icon: "⚠️",
          message: `CO2 level is elevated: ${value} ppm`,
          source: `${unitName} • ${time}`
        });
      }
    });

    return result
      .sort((a, b) => 0)
      .slice(0, 8);
  }

  const latestMetrics = useMemo(() => {
    const grouped = {
      Temperature: [],
      Humidity: [],
      "Air Quality Index": [],
      CO2: []
    };

    allData.forEach(item => {
      const metric = item.propertyName?.trim();
      if (grouped[metric]) grouped[metric].push(item);
    });

    return {
      Temperature: grouped.Temperature.length ? grouped.Temperature[grouped.Temperature.length - 1].value : "--",
      Humidity: grouped.Humidity.length ? grouped.Humidity[grouped.Humidity.length - 1].value : "--",
      "Air Quality Index": grouped["Air Quality Index"].length ? grouped["Air Quality Index"][grouped["Air Quality Index"].length - 1].value : "--",
      CO2: grouped.CO2.length ? grouped.CO2[grouped.CO2.length - 1].value : "--"
    };
  }, [allData]);

  const chartData = useMemo(() => {
    const filtered = allData.filter(item => item.propertyName?.trim() === selectedMetric);

    const groupedByUnit = {};
    filtered.forEach(item => {
      const unitName = item.unitName || `Unit ${item.unitId}`;
      if (!groupedByUnit[unitName]) groupedByUnit[unitName] = [];
      groupedByUnit[unitName].push(item);
    });

    Object.keys(groupedByUnit).forEach(unit => {
      groupedByUnit[unit].sort(
        (a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
      );
    });

    const colors = ["#16a34a", "#2563eb", "#dc2626", "#d97706", "#7c3aed", "#0891b2"];

    const datasets = Object.keys(groupedByUnit).map((unitName, index) => ({
      label: unitName,
      data: groupedByUnit[unitName].map(item => ({
        x: item.timestamp || item.createdAt,
        y: Number(item.value)
      })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.35
    }));

    return { datasets };
  }, [allData, selectedMetric]);

  const chartOptions = {
    responsive: true,
    parsing: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${selectedMetric} Levels Over Time`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp"
        }
      },
      y: {
        title: {
          display: true,
          text: metricInfo[selectedMetric]?.unit || "Value"
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row mb-4">
        <div className="col">
          <h4 className="fw-semibold mb-0">Environmental Monitoring System</h4>
          <small className="text-muted">Real-time sensor data and SMS alerts</small>
        </div>
      </div>

      <div className="row">
        {Object.keys(metricInfo).map(metric => {
          const value = latestMetrics[metric];
          const status = getMetricStatus(metric, value);
          return metricCard(
            metric,
            metricInfo[metric].icon,
            value,
            metricInfo[metric].unit,
            status.text,
            status.badge,
            "Latest"
          );
        })}
      </div>

      <div className="row mt-4">
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <ul className="nav nav-pills mb-3">
                {Object.keys(metricInfo).map(metric => (
                  <li className="nav-item me-2" key={metric}>
                    <button
                      className={`nav-link ${selectedMetric === metric ? "active" : ""}`}
                      onClick={() => setSelectedMetric(metric)}
                    >
                      {metric}
                    </button>
                  </li>
                ))}
              </ul>

              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">🔔 SMS Alerts</h6>
              {alerts.length === 0 ? (
                <p className="text-muted mb-0">No alerts available</p>
              ) : (
                alerts.map((alert, index) => (
                  <div key={index} className="mb-3 border-bottom pb-2">
                    <div className="d-flex justify-content-between">
                      <span>{alert.icon} <strong>{alert.message}</strong></span>
                      <span className={`badge ${alert.badge}`}>{alert.type}</span>
                    </div>
                    <div className="text-muted small">{alert.source}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Sensor Units</h6>
              {units.length === 0 ? (
                <p className="text-muted">No units found</p>
              ) : (
                units.map(unit => (
                  <div
                    key={unit.unitId}
                    className="card mb-2 border-0 bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => gotounit(unit.unitId)}
                  >
                    <div className="card-body p-3">
                      <h6 className="mb-1 text-primary">{unit.unitName}</h6>
                      <p className="mb-1 small text-muted">{unit.location}</p>
                      <small className="text-secondary">{unit.unitDescription}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
