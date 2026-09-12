const express = require("express");
const router = express.Router();
const {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  cancelEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Specific/static routes must come before dynamic ":id" routes
router.get("/my", protect, getMyEnrollments);
router.get("/", protect, admin, getAllEnrollments);
router.post("/", protect, createEnrollment);
router.put("/:id/cancel", protect, cancelEnrollment);
router.put("/:id/status", protect, admin, updateEnrollmentStatus);
router.get("/:id", protect, getEnrollmentById);

module.exports = router;
