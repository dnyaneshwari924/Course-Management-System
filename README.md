# CourseHub — MCA Course Management System

A full-stack Course Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Tech Stack
- **Frontend:** React.js, React Router DOM, Axios, Bootstrap
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt.js

---

## 1. Prerequisites
- Node.js (v18+) and npm installed
- MongoDB running locally (mongodb://127.0.0.1:27017) or a MongoDB Atlas connection string

---

## 2. Backend Setup

cd backend
npm install

Create a .env file in the backend folder:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/course_management_system
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d

Seed the database with 45 courses (5 per category) and two demo accounts:

npm run seed

Start the backend:

npm start

You should see:
Backend: http://localhost:5000
API:     http://localhost:5000/api

Important: Every time you run npm run seed, all existing users, courses, and enrollments are deleted and replaced with fresh data. Any JWT token you were using before becomes invalid — log in again to get a new one.

---

## 3. Frontend Setup

cd frontend
npm install

Create a .env file in the frontend folder:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Frontend runs at: http://localhost:5173

---

## 4. Demo / Test Accounts

Role    | Email             | Password
--------|-------------------|-------------
Student | student@cms.com   | Student@123
Admin   | admin@cms.com     | Admin@123

You can also register a new student account from the Register page.

---

## 5. Course Images

Every course has an image field storing a URL. By default, the seed script (backend/seed/seedCourses.js) generates a clean, colorful placeholder image per course using placehold.co, with each category assigned its own color:

Category                 | Color Code
--------------------------|-----------
Web Development           | 4361ee
Python                    | 2e8b57
Java                      | b5651d
Data Science              | 7209b7
Artificial Intelligence   | e63946
Machine Learning          | 0077b6
Database Management       | 264653
Cloud Computing           | 0096c7
Cyber Security            | 8d0801

Placeholder URL format:
https://placehold.co/600x400/<COLOR-CODE>/ffffff?text=<COURSE-NAME>

### Setting a custom image for one course
1. Log in as Admin → go to Manage Courses.
2. Click Edit on the course.
3. Paste any image URL into the Image URL field (or a local path like /my-photo.jpg if placed in frontend/public/).
4. Click Update.

### Using a local image file
1. Copy your image file into frontend/public/.
2. Avoid spaces in the filename (e.g. data-science.png).
3. Reference it as /data-science.png in the image field.
4. Restart the frontend dev server if it doesn't show up right away.

---

## 6. Postman Testing

Base URL: http://localhost:5000/api

### Public
POST /auth/register
POST /auth/login
GET  /courses
GET  /courses?search=Java
GET  /courses?category=Java
GET  /courses?level=Beginner
GET  /courses?category=Java&level=Advanced
GET  /courses/:id

### Student Token Required
GET  /auth/profile
POST /enrollments               body: { "courseId": "<id>" }
GET  /enrollments/my
GET  /enrollments/:id
PUT  /enrollments/:id/cancel
GET  /users/profile
PUT  /users/profile
GET  /dashboard/student

### Admin Token Required
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
GET    /users
GET    /users/:id
DELETE /users/:id
GET    /enrollments
PUT    /enrollments/:id/status  body: { "status": "Completed" }
GET    /dashboard/admin

### Expected Status Codes
200 OK / 201 Created — success
400 Bad Request — validation errors
401 Unauthorized — missing/invalid/expired token
403 Forbidden — student calling an admin-only route
404 Not Found — resource doesn't exist
409 Conflict — duplicate email, course code, or enrollment

### Test Checklist
- Register a new student
- Login as student / admin
- Access protected route without token → 401
- Student accesses admin route → 403
- Search / category filter / level filter / combined filters
- Enroll in a course
- Duplicate enrollment attempt → 409
- Enroll when seats = 0 → 400
- Cancel enrollment (course untouched, seat restored)
- View "My Enrollments" (only own enrollments visible)
- Update profile
- Admin: create / edit / delete a course
- Admin: duplicate course code → 409
- Admin: view/search students, delete a student
- Admin: view all enrollments, filter by status, change status

---

## 7. Project Structure

cms/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/seedCourses.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/api.js
    │   ├── context/AuthContext.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    └── package.json

## 8. Notes
- Cancelling a student's enrollment never deletes or modifies the course — it only changes that enrollment's status and restores one seat.
- Deleting a course (admin) is a separate operation from cancelling an enrollment.
- Course data lives entirely in MongoDB — nothing is hardcoded in the React frontend.

---

Developed by Dnyaneshwari Jogdand
