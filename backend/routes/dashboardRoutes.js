const express = require("express");
const router = express.Router();
const { getStudentStats, getAdminStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/student", protect, getStudentStats);
router.get("/admin", protect, admin, getAdminStats);

module.exports = router;
