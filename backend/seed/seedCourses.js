const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

dotenv.config();

const categories = [
  "Web Development",
  "Python",
  "Java",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Database Management",
  "Cloud Computing",
  "Cyber Security",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const instructors = [
  { name: "Dr. Anil Kulkarni", qualification: "Ph.D. Computer Science" },
  { name: "Prof. Sneha Deshmukh", qualification: "M.Tech, IIT Bombay" },
  { name: "Rahul Mehta", qualification: "M.S. Software Engineering" },
  { name: "Priya Nair", qualification: "MCA, B.Tech" },
  { name: "Dr. Vivek Rao", qualification: "Ph.D. AI & Robotics" },
  { name: "Ananya Sharma", qualification: "M.Tech Data Science" },
  { name: "Karan Patil", qualification: "Certified Cloud Architect" },
  { name: "Meera Iyer", qualification: "M.Sc. Cyber Security" },
];

const courseTopics = {
  "Web Development": [
    "HTML, CSS & JavaScript Fundamentals",
    "React.js for Beginners",
    "Full-Stack MERN Development",
    "Node.js & Express.js Backend Development",
    "Advanced React with Redux",
  ],
  "Python": [
    "Python Programming Basics",
    "Python for Data Analysis",
    "Django Web Framework",
    "Automation with Python",
    "Advanced Python Concepts",
  ],
  "Java": [
    "Core Java Programming",
    "Java for Enterprise Applications",
    "Spring Boot Microservices",
    "Advanced Java & Multithreading",
    "Java Data Structures & Algorithms",
  ],
  "Data Science": [
    "Introduction to Data Science",
    "Data Visualization with Python",
    "Statistics for Data Science",
    "Data Science with R",
    "Big Data Analytics",
  ],
  "Artificial Intelligence": [
    "Introduction to Artificial Intelligence",
    "AI Applications in Business",
    "Natural Language Processing",
    "Computer Vision Fundamentals",
    "Advanced AI Systems Design",
  ],
  "Machine Learning": [
    "Machine Learning Fundamentals",
    "Supervised & Unsupervised Learning",
    "Deep Learning with TensorFlow",
    "Machine Learning with Scikit-learn",
    "Advanced Neural Networks",
  ],
  "Database Management": [
    "Database Management Systems Basics",
    "MongoDB for Developers",
    "SQL & Relational Databases",
    "Database Design & Normalization",
    "NoSQL Database Architecture",
  ],
  "Cloud Computing": [
    "Introduction to Cloud Computing",
    "AWS Cloud Practitioner",
    "Azure Fundamentals",
    "Cloud Infrastructure & DevOps",
    "Serverless Architecture",
  ],
  "Cyber Security": [
    "Cyber Security Fundamentals",
    "Ethical Hacking Basics",
    "Network Security Essentials",
    "Application Security",
    "Advanced Penetration Testing",
  ],
};

const categoryColors = {
  "Web Development": "4361ee",
  "Python": "2e8b57",
  "Java": "b5651d",
  "Data Science": "7209b7",
  "Artificial Intelligence": "e63946",
  "Machine Learning": "0077b6",
  "Database Management": "264653",
  "Cloud Computing": "0096c7",
  "Cyber Security": "8d0801",
};

const categoryCodePrefix = {
  "Web Development": "WD",
  "Python": "PY",
  "Java": "JV",
  "Data Science": "DS",
  "Artificial Intelligence": "AI",
  "Machine Learning": "ML",
  "Database Management": "DB",
  "Cloud Computing": "CC",
  "Cyber Security": "CS",
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildCourses = () => {
  const courses = [];
  let counter = 1;

  categories.forEach((category) => {
    const topics = courseTopics[category];
    topics.forEach((topic, idx) => {
      const level = levels[idx % levels.length];
      const instructor = randomFrom(instructors);
      const prefix = categoryCodePrefix[category];
      const code = `${prefix}${String(counter).padStart(3, "0")}`;
      counter += 1;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (2 + Math.floor(Math.random() * 4)));

      courses.push({
        courseName: topic,
        courseCode: code,
        category,
        description: `A comprehensive ${level.toLowerCase()}-level course on ${topic}, designed to build practical, job-ready skills through hands-on projects and real-world examples.`,
        instructor: instructor.name,
        instructorQualification: instructor.qualification,
        duration: `${6 + Math.floor(Math.random() * 10)} weeks`,
        fee: 1999 + Math.floor(Math.random() * 15) * 500,
        level,
        image: `https://placehold.co/600x400/${categoryColors[category]}/ffffff?text=${encodeURIComponent(topic)}`,
        availableSeats: 20 + Math.floor(Math.random() * 40),
        syllabus: [
          `Introduction to ${topic}`,
          "Core Concepts and Hands-on Practice",
          "Real-World Projects",
          "Assessment and Certification",
        ],
        startDate,
        endDate,
      });
    });
  });

  return courses;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Enrollment.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    const courses = buildCourses();
    await Course.insertMany(courses);
    console.log(`Inserted ${courses.length} courses`);

    await User.create({
      name: "Admin User",
      email: "admin@cms.com",
      phone: "9999999999",
      password: "Admin@123",
      role: "admin",
      dateOfBirth: new Date("1990-01-01"),
      gender: "Other",
      address: "System Admin Office, Pune",
    });
    console.log("Created admin account: admin@cms.com / Admin@123");

    await User.create({
      name: "Test Student",
      email: "student@cms.com",
      phone: "8888888888",
      password: "Student@123",
      role: "student",
      dateOfBirth: new Date("2000-05-15"),
      gender: "Other",
      address: "Pune, Maharashtra",
    });
    console.log("Created student account: student@cms.com / Student@123");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();