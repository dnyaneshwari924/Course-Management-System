import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseList from "./pages/CourseList";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import MyEnrollments from "./pages/MyEnrollments";
import EnrollmentDetails from "./pages/EnrollmentDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCourses from "./pages/ManageCourses";
import ManageStudents from "./pages/ManageStudents";
import ManageEnrollments from "./pages/ManageEnrollments";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          <Route path="/dashboard" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
          <Route path="/my-enrollments" element={<ProtectedRoute role="student"><MyEnrollments /></ProtectedRoute>} />
          <Route path="/enrollments/:id" element={<ProtectedRoute><EnrollmentDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="admin"><ManageCourses /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><ManageStudents /></ProtectedRoute>} />
          <Route path="/admin/enrollments" element={<ProtectedRoute role="admin"><ManageEnrollments /></ProtectedRoute>} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
