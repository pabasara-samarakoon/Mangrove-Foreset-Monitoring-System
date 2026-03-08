import React, { useEffect, useState } from "react";
import { connection } from "../signalr";

function RealTimeData() {
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState("Connecting...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
        }
        setStatus("Connected to SignalR");
        setConnected(true);
        console.log("Connected to SignalR");
      } catch (err) {
        console.error(err);
        setStatus("Connection failed");
        setConnected(false);
      }
    };

    startConnection();

    connection.on("ReceiveData", (data) => {
      setValue(data);
    });

    return () => {
      connection.off("ReceiveData");
    };
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0 rounded-4">
            <div
              className="card-header text-white text-center py-4 rounded-top-4"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              }}
            >
              <h2 className="mb-1">📡 Real-Time Dashboard</h2>
              <p className="mb-0 small">Live sensor data from SignalR server</p>
            </div>

            <div className="card-body p-5">
              <div className="text-center mb-4">
                <span
                  className={`badge px-3 py-2 ${
                    connected ? "bg-success" : "bg-danger"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="row g-4">
                <div className="col-md-12">
                  <div className="card border-0 bg-light shadow-sm">
                    <div className="card-body text-center py-5">
                      <h5 className="text-muted mb-3">Current Sensor Value</h5>
                      <h1
                        className="fw-bold text-success"
                        style={{ fontSize: "4rem" }}
                      >
                        {value}
                      </h1>
                      <p className="text-muted mb-0">
                        Live value received from server
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="alert alert-info mb-0">
                  <strong>Note:</strong> This page listens for live data updates
                  from the backend using SignalR.
                </div>
              </div>
            </div>

            <div className="card-footer text-center bg-white border-0 pb-4">
              <small className="text-muted">
                Mangrove Forest Monitoring System - Real-Time Sensor Stream
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealTimeData;
