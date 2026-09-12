import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (Object.values(form).some((v) => !v)) return "All fields are required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Invalid email address";
    if (!/^[0-9]{10}$/.test(form.phone)) return "Mobile number must be 10 digits";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Student Registration</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Mobile Number</label>
                <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="10-digit number" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dateOfBirth" className="form-control" value={form.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center mt-3 small">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
