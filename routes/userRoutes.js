import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// CRUD (you can also add protect here if needed)
router.post("/", createUser);
router.get("/", protect,getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
