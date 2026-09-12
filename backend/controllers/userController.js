const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

// @route GET /api/users/profile (Student/Admin - own profile)
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/users/profile
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, dateOfBirth, gender, address } = req.body;
    if (name) user.name = name;
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Mobile number must be 10 digits" });
      }
      user.phone = phone;
    }
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (address) user.address = address;

    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.status(200).json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/users (Admin) - list all students, supports ?search=
const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: "student" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/users/:id (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/users/:id (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Enrollment.deleteMany({ student: user._id });
    await user.deleteOne();

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyProfile, updateMyProfile, getAllUsers, getUserById, deleteUser };
