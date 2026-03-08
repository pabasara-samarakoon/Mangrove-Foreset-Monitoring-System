import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
//import "./Login.css";

function LoginForm() {
 const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload
    
    const response = await fetch("http://localhost:5000/User/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password : password
      })
    });
    if (response.ok) {
          const res = await fetch("http://localhost:5000/User/whoami", {
          credentials: "include"
          });
          const data = await res.json(); // parse JSON
          setUser(data);
          console.log("Username:", data.username); 
          navigate("/dashboard"); 
    } else {
          alert("Login failed");
      }


  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body p-4">
          <h5 className="text-center text-muted mb-1">Environmental Monitoring System</h5>
          <p className="text-center text-secondary mb-4">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                value={username}
                onChange={e =>  setUsername(e.target.value)}
                className="form-control"
                placeholder="name@example.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-success w-100 mt-2">
              Sign In
            </button>
          </form>
          {message && <p>{message}</p>}

          <div className="text-center mt-3">
            <span className="text-muted">Don't have an account? </span>
            <a href="/register" className="text-decoration-none">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
