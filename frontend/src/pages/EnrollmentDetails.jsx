import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const EnrollmentDetails = () => {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchEnrollment = async () => {
    try {
      const { data } = await api.get(`/enrollments/${id}`);
      setEnrollment(data);
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment not found");
    }
  };

  useEffect(() => {
    fetchEnrollment();
    // eslint-disable-next-line
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;
    try {
      await api.put(`/enrollments/${id}/cancel`);
      setMessage("Enrollment cancelled successfully");
      fetchEnrollment();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to cancel enrollment");
    }
  };

  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!enrollment) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  const { student, course } = enrollment;

  return (
    <div className="container py-4" style={{ maxWidth: "700px" }}>
      <button className="btn btn-link mb-3 px-0" onClick={() => navigate(-1)}>&larr; Back</button>
      <h2 className="mb-4">Enrollment Details</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-3 shadow-sm">
        <div className="card-header fw-bold">Student Information</div>
        <div className="card-body">
          <p><strong>Name:</strong> {student?.name}</p>
          <p><strong>Email:</strong> {student?.email}</p>
          <p className="mb-0"><strong>Mobile:</strong> {student?.phone}</p>
        </div>
      </div>

      <div className="card mb-3 shadow-sm">
        <div className="card-header fw-bold">Course Information</div>
        <div className="card-body">
          <p><strong>Course Name:</strong> {course?.courseName}</p>
          <p><strong>Course Code:</strong> {course?.courseCode}</p>
          <p><strong>Category:</strong> {course?.category}</p>
          <p><strong>Instructor:</strong> {course?.instructor}</p>
          <p><strong>Duration:</strong> {course?.duration}</p>
          <p className="mb-0"><strong>Fee:</strong> ₹{course?.fee}</p>
        </div>
      </div>

      <div className="card mb-3 shadow-sm">
        <div className="card-header fw-bold">Enrollment Information</div>
        <div className="card-body">
          <p><strong>Enrollment ID:</strong> {enrollment._id}</p>
          <p><strong>Enrollment Date:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
          <p className="mb-0"><strong>Status:</strong> {enrollment.status}</p>
        </div>
      </div>

      {enrollment.status === "Active" && (
        <button className="btn btn-danger" onClick={handleCancel}>Cancel Enrollment</button>
      )}
    </div>
  );
};

export default EnrollmentDetails;
