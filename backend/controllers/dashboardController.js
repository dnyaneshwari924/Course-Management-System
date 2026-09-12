const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

// @route GET /api/dashboard/student
const getStudentStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const myEnrollments = await Enrollment.find({ student: req.user._id });
    const activeCourses = myEnrollments.filter((e) => e.status === "Active").length;
    const completedCourses = myEnrollments.filter((e) => e.status === "Completed").length;

    res.status(200).json({
      totalCourses,
      totalEnrollments: myEnrollments.length,
      activeCourses,
      completedCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/dashboard/admin
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: "Active" });
    const completedEnrollments = await Enrollment.countDocuments({ status: "Completed" });
    const cancelledEnrollments = await Enrollment.countDocuments({ status: "Cancelled" });

    res.status(200).json({
      totalStudents,
      totalCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      cancelledEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getStudentStats, getAdminStats };
