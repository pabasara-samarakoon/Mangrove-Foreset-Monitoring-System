import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUnitForm() {
  const [unitName, setUnitname] = useState("");
  const [unitDescription, setUnitdescription] = useState("");
  const [location, setUnitlocation] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/Data/AddUnit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          unitname: unitName,
          unitdescription: unitDescription,
          location: location
        })
      });

      if (response.ok) {
        setMessage("Unit added successfully.");
        setMessageType("success");

        setUnitname("");
        setUnitdescription("");
        setUnitlocation("");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        setMessage("Failed to add unit.");
        setMessageType("danger");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 rounded-4">
            <div
              className="card-header text-white text-center py-4 rounded-top-4"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              }}
            >
              <h3 className="mb-1">➕ Add Sensor Unit</h3>
              <p className="mb-0 small">Create a new unit for environmental monitoring</p>
            </div>

            <div className="card-body p-4">
              {message && (
                <div className={`alert alert-${messageType}`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Unit Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={unitName}
                    onChange={(e) => setUnitname(e.target.value)}
                    placeholder="Enter unit name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={unitDescription}
                    onChange={(e) => setUnitdescription(e.target.value)}
                    placeholder="Enter unit description"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={location}
                    onChange={(e) => setUnitlocation(e.target.value)}
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Unit"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-muted text-center small bg-white border-0 pb-4">
              Mangrove Forest Monitoring System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUnitForm;
