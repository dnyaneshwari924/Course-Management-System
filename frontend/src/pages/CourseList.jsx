import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import CourseCard from "../components/CourseCard";

const categories = [
  "Web Development", "Python", "Java", "Data Science",
  "Artificial Intelligence", "Machine Learning",
  "Database Management", "Cloud Computing", "Cyber Security",
];
const levels = ["Beginner", "Intermediate", "Advanced"];

const CourseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (level) params.level = level;
      const { data } = await api.get("/courses", { params });
      setCourses(data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (level) params.level = level;
    setSearchParams(params);
    fetchCourses();
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLevel("");
    setSearchParams({});
    setTimeout(fetchCourses, 0);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Courses</h2>

      <form className="row g-2 mb-4" onSubmit={handleFilter}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, code, or instructor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All Levels</option>
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100">Filter</button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="alert alert-info">No courses found matching your criteria.</div>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
