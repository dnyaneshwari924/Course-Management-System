import { useEffect, useState } from "react";
import api from "../services/api";
import EnrollmentCard from "../components/EnrollmentCard";

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/enrollments/my");
      setEnrollments(data.enrollments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;
    try {
      await api.put(`/enrollments/${id}/cancel`);
      setMessage("Enrollment cancelled successfully");
      fetchEnrollments();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to cancel enrollment");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Enrollments</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : enrollments.length === 0 ? (
        <div className="alert alert-info">You have not enrolled in any courses yet.</div>
      ) : (
        <div className="row">
          {enrollments.map((e) => (
            <EnrollmentCard key={e._id} enrollment={e} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;
