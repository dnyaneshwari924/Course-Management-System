import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/student").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Welcome, {user?.name} 👋</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Courses</h6>
            <h3 className="text-primary">{stats?.totalCourses ?? "-"}</h3>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Enrollments</h6>
            <h3 className="text-primary">{stats?.totalEnrollments ?? "-"}</h3>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card text-center shadow-sm p-3">
            <h6>Active Courses</h6>
            <h3 className="text-success">{stats?.activeCourses ?? "-"}</h3>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card text-center shadow-sm p-3">
            <h6>Completed Courses</h6>
            <h3 className="text-secondary">{stats?.completedCourses ?? "-"}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/courses" className="btn btn-outline-primary w-100 py-3">View Courses</Link>
        </div>
        <div className="col-md-4">
          <Link to="/my-enrollments" className="btn btn-outline-primary w-100 py-3">My Enrollments</Link>
        </div>
        <div className="col-md-4">
          <Link to="/profile" className="btn btn-outline-primary w-100 py-3">My Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
