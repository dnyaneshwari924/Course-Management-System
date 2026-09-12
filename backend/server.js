const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Course Management System API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
  console.log(`API:     http://localhost:${PORT}/api`);
});
