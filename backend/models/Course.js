const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Python",
        "Java",
        "Data Science",
        "Artificial Intelligence",
        "Machine Learning",
        "Database Management",
        "Cloud Computing",
        "Cyber Security",
      ],
    },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    instructorQualification: { type: String, required: true },
    duration: { type: String, required: true },
    fee: { type: Number, required: true, min: 0 },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    image: { type: String, default: "https://placehold.co/600x400?text=Course" },
    availableSeats: { type: Number, required: true, min: 0 },
    syllabus: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

courseSchema.index({ courseName: "text", instructor: "text" });

module.exports = mongoose.model("Course", courseSchema);
