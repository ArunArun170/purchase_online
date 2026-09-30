const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const HeroSlide = require("../models/HeroSlide");

const router = express.Router();

// GET all hero slides
router.get("/", async (req, res) => {
  try {
    const slides = await HeroSlide.find()
      .sort({ createdAt: 1 })
      .lean();

    res.json(slides);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hero slides",
      error: error.message,
    });
  }
});

// GET single hero slide
router.get("/:id", async (req, res) => {
  try {
    const slide = await HeroSlide.findOne({
      id: req.params.id,
    }).lean();

    if (!slide) {
      return res.status(404).json({
        message: "Hero slide not found",
      });
    }

    res.json(slide);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hero slide",
      error: error.message,
    });
  }
});

// POST new hero slide
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const slide = new HeroSlide(req.body);

    const savedSlide = await slide.save();

    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create hero slide",
      error: error.message,
    });
  }
});

// PUT update hero slide
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const slide =
      await HeroSlide.findOneAndUpdate(
        {
          id: req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!slide) {
      return res.status(404).json({
        message: "Hero slide not found",
      });
    }

    res.json(slide);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update hero slide",
      error: error.message,
    });
  }
});

// DELETE hero slide
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const slide =
      await HeroSlide.findOneAndDelete({
        id: req.params.id,
      });

    if (!slide) {
      return res.status(404).json({
        message: "Hero slide not found",
      });
    }

    res.json({
      message: "Hero slide deleted successfully",
      slide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete hero slide",
      error: error.message,
    });
  }
});

module.exports = router;