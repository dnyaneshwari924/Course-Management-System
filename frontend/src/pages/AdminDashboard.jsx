import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Students", value: stats?.totalStudents, color: "primary" },
    { label: "Total Courses", value: stats?.totalCourses, color: "info" },
    { label: "Total Enrollments", value: stats?.totalEnrollments, color: "secondary" },
    { label: "Active Enrollments", value: stats?.activeEnrollments, color: "success" },
    { label: "Completed Enrollments", value: stats?.completedEnrollments, color: "dark" },
    { label: "Cancelled Enrollments", value: stats?.cancelledEnrollments, color: "danger" },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-md-4 col-sm-6" key={c.label}>
            <div className="card text-center shadow-sm p-3">
              <h6>{c.label}</h6>
              <h3 className={`text-${c.color}`}>{c.value ?? "-"}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/admin/courses" className="btn btn-outline-primary w-100 py-3">Manage Courses</Link>
        </div>
        <div className="col-md-4">
          <Link to="/admin/students" className="btn btn-outline-primary w-100 py-3">Manage Students</Link>
        </div>
        <div className="col-md-4">
          <Link to="/admin/enrollments" className="btn btn-outline-primary w-100 py-3">Manage Enrollments</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
