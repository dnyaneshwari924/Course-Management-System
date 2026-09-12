import { Link } from "react-router-dom";

const statusBadge = {
  Active: "success",
  Completed: "primary",
  Cancelled: "secondary",
};

const EnrollmentCard = ({ enrollment, onCancel }) => {
  const { course } = enrollment;
  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span className="badge bg-secondary">{course?.courseCode}</span>
            <span className={`badge bg-${statusBadge[enrollment.status]}`}>{enrollment.status}</span>
          </div>
          <h5 className="card-title">{course?.courseName}</h5>
          <p className="mb-1 small"><strong>Category:</strong> {course?.category}</p>
          <p className="mb-1 small"><strong>Instructor:</strong> {course?.instructor}</p>
          <p className="mb-1 small"><strong>Duration:</strong> {course?.duration}</p>
          <p className="mb-2 small">
            <strong>Enrolled on:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}
          </p>
          <div className="d-flex gap-2">
            <Link to={`/enrollments/${enrollment._id}`} className="btn btn-outline-primary btn-sm w-100">
              View Details
            </Link>
            {enrollment.status === "Active" && (
              <button className="btn btn-outline-danger btn-sm w-100" onClick={() => onCancel(enrollment._id)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;
