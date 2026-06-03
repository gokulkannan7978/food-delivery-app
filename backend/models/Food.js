const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    time: {
      type: String,
      default: "30 min",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index for search
foodSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Food", foodSchema);
