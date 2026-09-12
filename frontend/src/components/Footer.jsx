const Footer = () => {
  return (
    <footer id="contact" className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <h5>📚 CourseHub</h5>
        <p className="mb-1">Learn Today, Build Your Future</p>
        <p className="mb-1 small">Contact: support@coursehub.example | +91 7498575315</p>
        <p className="mb-0 small text-secondary">
          &copy; {new Date().getFullYear()} CourseHub — MCA Course Management System Project
        </p>
        <p className="mb-0 small text-secondary">
          Developed by <strong>@Dnyaneshwari Jogdand</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;