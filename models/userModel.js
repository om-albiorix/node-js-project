import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    }
  },
  { timestamps: true } // createdAt & updatedAt
);

// Create model
const User = mongoose.model("User", userSchema);

export default User;
