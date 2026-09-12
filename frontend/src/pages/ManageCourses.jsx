import { useEffect, useState } from "react";
import api from "../services/api";

const categories = [
  "Web Development", "Python", "Java", "Data Science",
  "Artificial Intelligence", "Machine Learning",
  "Database Management", "Cloud Computing", "Cyber Security",
];
const levels = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  courseName: "", courseCode: "", category: categories[0], description: "",
  instructor: "", instructorQualification: "", duration: "", fee: "",
  level: levels[0], image: "", availableSeats: "", syllabus: "",
  startDate: "", endDate: "",
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await api.get("/courses");
    setCourses(data.courses);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (course) => {
    setForm({
      ...course,
      startDate: course.startDate?.slice(0, 10),
      endDate: course.endDate?.slice(0, 10),
      syllabus: (course.syllabus || []).join(", "),
    });
    setEditingId(course._id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const payload = {
      ...form,
      fee: Number(form.fee),
      availableSeats: Number(form.availableSeats),
      syllabus: form.syllabus.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        setMessage("Course updated successfully");
      } else {
        await api.post("/courses", payload);
        setMessage("Course created successfully");
      }
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This does not affect existing student enrollments.")) return;
    try {
      await api.delete(`/courses/${id}`);
      setMessage("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Courses</h2>
        <button className="btn btn-primary" onClick={openAddForm}>+ Add Course</button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>{editingId ? "Edit Course" : "Add New Course"}</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Course Name</label>
                  <input className="form-control" name="courseName" value={form.courseName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Course Code</label>
                  <input className="form-control" name="courseCode" value={form.courseCode} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Level</label>
                  <select className="form-select" name="level" value={form.level} onChange={handleChange}>
                    {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Instructor</label>
                  <input className="form-control" name="instructor" value={form.instructor} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Instructor Qualification</label>
                  <input className="form-control" name="instructorQualification" value={form.instructorQualification} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Duration</label>
                  <input className="form-control" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 8 weeks" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fee (₹)</label>
                  <input type="number" className="form-control" name="fee" value={form.fee} onChange={handleChange} min="0" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Available Seats</label>
                  <input type="number" className="form-control" name="availableSeats" value={form.availableSeats} onChange={handleChange} min="0" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" name="startDate" value={form.startDate} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" name="endDate" value={form.endDate} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input className="form-control" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="col-12">
                  <label className="form-label">Syllabus (comma-separated)</label>
                  <input className="form-control" name="syllabus" value={form.syllabus} onChange={handleChange} placeholder="Topic 1, Topic 2, Topic 3" />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Code</th><th>Name</th><th>Category</th><th>Level</th>
                <th>Fee</th><th>Seats</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>{c.courseCode}</td>
                  <td>{c.courseName}</td>
                  <td>{c.category}</td>
                  <td><span className="badge bg-info">{c.level}</span></td>
                  <td>₹{c.fee}</td>
                  <td>{c.availableSeats}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditForm(c)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
