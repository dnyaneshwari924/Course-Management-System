import { useEffect, useState } from "react";
import api from "../services/api";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await api.get("/users", { params: search ? { search } : {} });
    setStudents(data.users);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student? This will remove their enrollments as well.")) return;
    try {
      await api.delete(`/users/${id}`);
      setMessage("Student deleted successfully");
      setSelected(null);
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Students</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Mobile</th><th>Registered</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setSelected(s)}>View</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="card shadow-sm mt-3" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <h5>Student Details</h5>
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Mobile:</strong> {selected.phone}</p>
            <p><strong>Date of Birth:</strong> {new Date(selected.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {selected.gender}</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <p className="mb-0"><strong>Registered:</strong> {new Date(selected.createdAt).toLocaleDateString()}</p>
            <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
