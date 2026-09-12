import { Link } from "react-router-dom";

const levelBadge = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
};

const CourseCard = ({ course }) => {
  return (
    <div className="col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm course-card">
        <img src={course.image} className="card-img-top" alt={course.courseName} style={{ height: "180px", objectFit: "cover" }} />
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="badge bg-secondary">{course.courseCode}</span>
            <span className={`badge bg-${levelBadge[course.level] || "info"}`}>{course.level}</span>
          </div>
          <h5 className="card-title">{course.courseName}</h5>
          <p className="text-muted small mb-1">{course.category}</p>
          <p className="card-text small flex-grow-1">
            {course.description?.slice(0, 90)}...
          </p>
          <p className="mb-1 small"><strong>Instructor:</strong> {course.instructor}</p>
          <p className="mb-1 small"><strong>Duration:</strong> {course.duration}</p>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-primary">₹{course.fee}</span>
            <span className="small text-muted">{course.availableSeats} seats left</span>
          </div>
          <Link to={`/courses/${course._id}`} className="btn btn-primary w-100">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
