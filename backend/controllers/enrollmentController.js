const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// @route POST /api/enrollments (Student)
const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "courseId is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ["Active", "Completed"] },
    });
    if (existing) {
      return res.status(409).json({ message: "You are already enrolled in this course" });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available for this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      status: "Active",
    });

    course.availableSeats -= 1;
    await course.save();

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You are already enrolled in this course" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/enrollments/my (Student)
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/enrollments/:id (Student - own only, or Admin)
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("course")
      .populate("student", "-password");

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    if (req.user.role !== "admin" && enrollment.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/enrollments/:id/cancel (Student - own only)
const cancelEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only cancel your own enrollment" });
    }

    if (enrollment.status === "Cancelled") {
      return res.status(400).json({ message: "Enrollment is already cancelled" });
    }

    enrollment.status = "Cancelled";
    await enrollment.save();

    // Restore a seat; the course itself is never deleted or altered otherwise
    const course = await Course.findById(enrollment.course);
    if (course) {
      course.availableSeats += 1;
      await course.save();
    }

    res.status(200).json({ message: "Enrollment cancelled successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/enrollments (Admin) - supports ?status=
const getAllEnrollments = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;

    let enrollments = await Enrollment.find(query)
      .populate("course")
      .populate("student", "-password")
      .sort({ createdAt: -1 });

    if (search) {
      const lower = search.toLowerCase();
      enrollments = enrollments.filter(
        (e) =>
          e.student?.name?.toLowerCase().includes(lower) ||
          e.student?.email?.toLowerCase().includes(lower) ||
          e.course?.courseName?.toLowerCase().includes(lower)
      );
    }

    res.status(200).json({ count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/enrollments/:id/status (Admin)
const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    const wasCancelled = enrollment.status === "Cancelled";
    const willBeCancelled = status === "Cancelled";

    enrollment.status = status;
    await enrollment.save();

    // Keep seat count consistent when status changes to/from Cancelled
    if (!wasCancelled && willBeCancelled) {
      const course = await Course.findById(enrollment.course);
      if (course) {
        course.availableSeats += 1;
        await course.save();
      }
    } else if (wasCancelled && !willBeCancelled) {
      const course = await Course.findById(enrollment.course);
      if (course && course.availableSeats > 0) {
        course.availableSeats -= 1;
        await course.save();
      }
    }

    res.status(200).json({ message: "Enrollment status updated", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  cancelEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
};
