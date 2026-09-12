const Course = require("../models/Course");

// @route GET /api/courses
// Supports: ?search=&category=&level=
const getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/courses (Admin)
const createCourse = async (req, res) => {
  try {
    const {
      courseName, courseCode, category, description, instructor,
      instructorQualification, duration, fee, level, image,
      availableSeats, syllabus, startDate, endDate,
    } = req.body;

    if (!courseName || !courseCode || !category || !description || !instructor ||
        !instructorQualification || !duration || fee === undefined ||
        !level || availableSeats === undefined || !startDate || !endDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (fee < 0) return res.status(400).json({ message: "Fee must be a positive number" });
    if (availableSeats < 0) return res.status(400).json({ message: "Available seats must be a positive number" });
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const existing = await Course.findOne({ courseCode });
    if (existing) return res.status(409).json({ message: "Course code already exists" });

    const course = await Course.create({
      courseName, courseCode, category, description, instructor,
      instructorQualification, duration, fee, level, image,
      availableSeats, syllabus, startDate, endDate,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/courses/:id (Admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.body.courseCode && req.body.courseCode !== course.courseCode) {
      const duplicate = await Course.findOne({ courseCode: req.body.courseCode });
      if (duplicate) return res.status(409).json({ message: "Course code already exists" });
    }

    if (req.body.fee !== undefined && req.body.fee < 0) {
      return res.status(400).json({ message: "Fee must be a positive number" });
    }
    if (req.body.availableSeats !== undefined && req.body.availableSeats < 0) {
      return res.status(400).json({ message: "Available seats must be a positive number" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/courses/:id (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
