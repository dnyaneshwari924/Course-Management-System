import { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users/profile").then((res) => {
      setProfile(res.data);
      setForm({
        name: res.data.name,
        phone: res.data.phone,
        dateOfBirth: res.data.dateOfBirth?.slice(0, 10),
        gender: res.data.gender,
        address: res.data.address,
      });
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.put("/users/profile", form);
      setProfile(data.user);
      setMessage("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (!profile) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">My Profile</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {!editMode ? (
            <>
              <p><strong>Full Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Mobile:</strong> {profile.phone}</p>
              <p><strong>Date of Birth:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {profile.gender}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dateOfBirth" className="form-control" value={form.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
