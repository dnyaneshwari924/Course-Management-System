import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          📚 CourseHub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#contact">Contact</Link>
            </li>
            {isAuthenticated && user.role === "student" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-enrollments">My Enrollments</Link>
                </li>
              </>
            )}
            {isAuthenticated && user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm ms-2 mt-1" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">👤 {user.name}</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2 mt-1" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
