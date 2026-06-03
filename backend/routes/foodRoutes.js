const express = require("express");
const router = express.Router();
const {
  getAllFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
  getCategories,
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Public routes
router.get("/", getAllFoods);
router.get("/categories", getCategories);
router.get("/:id", getFoodById);

// Admin-only routes
router.post("/", protect, adminOnly, addFood);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

module.exports = router;
