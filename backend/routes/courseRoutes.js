const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, admin, createCourse);
router.put("/:id", protect, admin, updateCourse);
router.delete("/:id", protect, admin, deleteCourse);

module.exports = router;
