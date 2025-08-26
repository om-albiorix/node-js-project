import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";  

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

// -------- AUTH --------
// Register
export const  register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) 
    return res.status(400).json({ success: false, message: "All fields required" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: "Email already in use" });

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const token = signToken(user._id);
  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

// Me
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ success: true, data: user });
});

// -------- CRUD --------

// Create (admin or for demos)
export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// Read all (with pagination/filter/sort)
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", sort = "-createdAt" } = req.query;

  const query = search
    ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
    : {};

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    User.find(query).sort(sort).skip(skip).limit(Number(limit)),
    User.countDocuments(query)
  ]);

  res.json({
    success: true,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit)
    },
    data: items
  });
});

// Read one
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
});

// Update
export const updateUser = asyncHandler(async (req, res) => {
  // if password is included, Mongoose pre-save hashing won't run with findByIdAndUpdate.
  // So either disallow here or handle manually.
  if (req.body.password) delete req.body.password;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
});

// Delete
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, message: "User deleted" });
});
