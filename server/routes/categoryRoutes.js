const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const Category = require("../models/Category");

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: 1 })
      .lean();

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      id: req.params.id,
    }).lean();

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
});

// POST new category
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);

    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
});

// PUT update category
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      {
        id: req.params.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
});

// DELETE category
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const category =
      await Category.findOneAndDelete({
        id: req.params.id,
      });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
});

module.exports = router;