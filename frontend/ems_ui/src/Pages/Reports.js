import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("Temperature");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/Data/getalldashboarddata`, {
        method: "POST",
        credentials: "include"
      });

      const data = response.ok ? await response.json() : [];
      setReportData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading reports:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    return reportData.filter(
      item => item.propertyName?.trim() === selectedMetric
    );
  }, [reportData, selectedMetric]);

  const summary = useMemo(() => {
    const values = filteredData.map(item => Number(item.value)).filter(v => !isNaN(v));

    if (values.length === 0) {
      return { min: "--", max: "--", avg: "--", count: 0 };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

    return { min, max, avg, count: values.length };
  }, [filteredData]);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold">Reports</h3>
        <p className="text-muted mb-0">Environmental monitoring summaries by metric and timestamp</p>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            {["Temperature", "Humidity", "Air Quality Index", "CO2"].map(metric => (
              <button
                key={metric}
                className={`btn ${selectedMetric === metric ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setSelectedMetric(metric)}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <h6 className="text-muted">Min Value</h6>
              <h3 className="fw-bold text-primary">{summary.min}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <h6 className="text-muted">Max Value</h6>
              <h3 className="fw-bold text-danger">{summary.max}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <h6 className="text-muted">Average</h6>
              <h3 className="fw-bold text-success">{summary.avg}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <h6 className="text-muted">Records</h6>
              <h3 className="fw-bold text-dark">{summary.count}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-3 text-muted">Loading reports...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No report data found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Unit</th>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.unitName || `Unit ${item.unitId}`}</td>
                      <td>{item.propertyName}</td>
                      <td>{item.value}</td>
                      <td>{item.timestamp || item.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
