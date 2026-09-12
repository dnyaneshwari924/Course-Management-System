import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statuses = ["Active", "Completed", "Cancelled"];

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEnrollments = async () => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    const { data } = await api.get("/enrollments", { params });
    setEnrollments(data.enrollments);
    setLoading(false);
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchEnrollments();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/enrollments/${id}/status`, { status: newStatus });
      setMessage("Enrollment status updated");
      fetchEnrollments();
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Enrollments</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form className="row g-2 mb-4" onSubmit={handleFilter}>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Search by student or course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Filter</button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Student</th><th>Course</th><th>Enrolled On</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e._id}>
                  <td>{e.student?.name}<br /><span className="text-muted small">{e.student?.email}</span></td>
                  <td>{e.course?.courseName}<br /><span className="text-muted small">{e.course?.courseCode}</span></td>
                  <td>{new Date(e.enrollmentDate).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={e.status}
                      onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <Link to={`/enrollments/${e._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEnrollments;
