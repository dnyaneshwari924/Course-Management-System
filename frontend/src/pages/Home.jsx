import { Link } from "react-router-dom";

const categories = [
  "Web Development", "Python", "Java", "Data Science",
  "Artificial Intelligence", "Machine Learning",
  "Database Management", "Cloud Computing", "Cyber Security",
];

const Home = () => {
  return (
    <div>
      <section className="bg-primary text-white text-center py-5">
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Learn Today, Build Your Future</h1>
          <p className="lead mb-4">
            Explore 40+ industry-relevant courses across Web Development, AI, Data Science, Cloud & more.
          </p>
          <Link to="/courses" className="btn btn-light btn-lg me-3">Explore Courses</Link>
          <Link to="/register" className="btn btn-outline-light btn-lg">Register Now</Link>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">Course Categories</h2>
        <div className="row g-3">
          {categories.map((cat) => (
            <div className="col-md-4 col-sm-6" key={cat}>
              <Link
                to={`/courses?category=${encodeURIComponent(cat)}`}
                className="d-block card shadow-sm text-decoration-none text-dark p-3 h-100"
              >
                <h5 className="mb-0">{cat}</h5>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-3">About CourseHub</h2>
          <p className="lead" style={{ maxWidth: "700px", margin: "0 auto" }}>
            CourseHub is an MCA-level Course Management System built with the MERN stack,
            offering a complete learning platform with secure authentication, course
            enrollment, and dashboards for students and administrators.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
