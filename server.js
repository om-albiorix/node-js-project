import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
