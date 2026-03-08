import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/User/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          confirmedPassword: confirmedPassword,
        })
      });

      const result = await response.json();
      
      if (result.success) {
        navigate(result.redirectTo);
      } else {
        setMessage(result.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMessageClass = () => {
    if (message.includes("success") || message.includes("welcome")) return "text-success";
    if (message.includes("error") || message.includes("failed")) return "text-danger";
    return "text-warning";
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0 fw-semibold">🌿 Environmental Monitor</h2>
                <p className="mb-0 opacity-75 mt-1">Create your account</p>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">📧 Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-3 shadow-sm"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">🔒 Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-3 shadow-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      minLength="6"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">🔐 Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-3 shadow-sm"
                      placeholder="Confirm your password"
                      value={confirmedPassword}
                      onChange={e => setConfirmedPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg w-100 rounded-3 fw-semibold py-3 mb-3 shadow"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Message */}
                  {message && (
                    <div className={`alert alert-dismissible fade show rounded-3 ${getMessageClass()} border-0 shadow-sm`}>
                      {message}
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setMessage("")}
                      ></button>
                    </div>
                  )}
                </form>

                {/* Login link */}
                <div className="text-center mt-4 pt-3 border-top">
                  <span className="text-muted">Already have an account? </span>
                  <a href="/login" className="text-decoration-none fw-semibold text-primary">
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
