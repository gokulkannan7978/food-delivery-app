const Food = require("../models/Food");

// ─── Get All Foods ────────────────────────────────────────────────────────────
// GET /api/foods?category=Veg&search=paneer&sort=low&page=1&limit=12
const getAllFoods = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;

    const query = { isAvailable: true };

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Helper for aliases
    const resolveAlias = (term) => {
      const lower = term.toLowerCase().trim();
      const biryaniAliases = ["biriyani", "briyani", "briyaani", "briani"];
      const parottaAliases = ["parota", "barotta", "burota"];
      const dosaAliases = ["dosai"];
      
      if (biryaniAliases.includes(lower)) return "biryani";
      if (parottaAliases.includes(lower)) return "parotta";
      if (dosaAliases.includes(lower)) return "dosa";
      
      return term;
    };

    // Search by name or description (uses text index)
    if (search) {
      const resolvedSearch = resolveAlias(search);
      query.$or = [
        { name: { $regex: resolvedSearch, $options: "i" } },
        { description: { $regex: resolvedSearch, $options: "i" } },
        { category: { $regex: resolvedSearch, $options: "i" } },
      ];
    }

    // Sort logic
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "low") sortOption = { price: 1 };
    if (sort === "high") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Food.countDocuments(query);
    const foods = await Food.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Food ──────────────────────────────────────────────────────────
// GET /api/foods/:id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found." });
    }
    res.status(200).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Add Food (Admin) ─────────────────────────────────────────────────────────
// POST /api/foods
const addFood = async (req, res) => {
  try {
    const { name, price, category, image, description, rating, time } = req.body;

    if (!name || !price || !category || !image || !description) {
      return res.status(400).json({
        success: false,
        message: "name, price, category, image, description are required.",
      });
    }

    const food = await Food.create({ name, price, category, image, description, rating, time });

    res.status(201).json({ success: true, message: "Food item added.", food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Food (Admin) ──────────────────────────────────────────────────────
// PUT /api/foods/:id
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found." });
    }
    res.status(200).json({ success: true, message: "Food updated.", food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Food (Admin) ──────────────────────────────────────────────────────
// DELETE /api/foods/:id
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found." });
    }
    res.status(200).json({ success: true, message: "Food deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Categories ───────────────────────────────────────────────────────
// GET /api/foods/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Food.distinct("category");
    res.status(200).json({ success: true, categories: ["All", ...categories] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllFoods, getFoodById, addFood, updateFood, deleteFood, getCategories };
