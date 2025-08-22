import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes)

// Health check
app.get("/", (_req, res) => {
  res.send("API is running ✅");
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = process.env.PORT;
await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
