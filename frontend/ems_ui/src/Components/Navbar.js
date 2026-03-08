import React from "react";
import { useAuth } from "./AuthContext"; // your existing hook
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      boxShadow: "0 2px 10px rgba(16, 185, 129, 0.3)"
    }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🌿 EMS - Mangrove Monitor
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/units">Units</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/alerts">Alerts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">Reports</Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    👋 {user.name || "User"}
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/profile">Profile</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-light ms-2" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
