import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch(() => setError("Course not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user.role !== "student") {
      setError("Only students can enroll in courses");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.post("/enrollments", { courseId: id });
      setMessage("Enrolled successfully! Check My Enrollments.");
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (error && !course) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5 mb-4">
          <img src={course.image} alt={course.courseName} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-md-7">
          <span className="badge bg-secondary me-2">{course.courseCode}</span>
          <span className="badge bg-info">{course.level}</span>
          <h2 className="mt-2">{course.courseName}</h2>
          <p className="text-muted">{course.category}</p>
          <p>{course.description}</p>
          <table className="table table-sm">
            <tbody>
              <tr><th>Instructor</th><td>{course.instructor}</td></tr>
              <tr><th>Qualification</th><td>{course.instructorQualification}</td></tr>
              <tr><th>Duration</th><td>{course.duration}</td></tr>
              <tr><th>Fee</th><td>₹{course.fee}</td></tr>
              <tr><th>Available Seats</th><td>{course.availableSeats}</td></tr>
              <tr><th>Start Date</th><td>{new Date(course.startDate).toLocaleDateString()}</td></tr>
              <tr><th>End Date</th><td>{new Date(course.endDate).toLocaleDateString()}</td></tr>
            </tbody>
          </table>

          {course.syllabus?.length > 0 && (
            <>
              <h5>Syllabus</h5>
              <ul>
                {course.syllabus.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </>
          )}

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-primary btn-lg" onClick={handleEnroll} disabled={course.availableSeats <= 0}>
            {course.availableSeats <= 0 ? "Seats Full" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
