const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      enum: ["Biryani", "South Indian", "Non-Veg", "Starters", "Desserts", "Drinks", "Pizza", "Burger", "Chinese", "North Indian"],
    },
    description: {
      type: String,
      default: "",
    },
    emoji: {
      type: String,
      default: "🍽",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
