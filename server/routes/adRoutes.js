const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const Ad = require("../models/Ad");

const router = express.Router();

const defaultAds = {
  key: "homepage",
  testimonial: {},
  mid_image: {},
  ad_images: [],
};

// GET homepage advertisements
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.findOne({ key: "homepage" }).lean();

    res.json(ads || defaultAds);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch advertisements",
      error: error.message,
    });
  }
});

// PUT homepage advertisements
router.put("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const updatedAds = await Ad.findOneAndUpdate(
      { key: "homepage" },
      {
        key: "homepage",
        testimonial: req.body.testimonial || {},
        mid_image: req.body.mid_image || {},
        ad_images: Array.isArray(req.body.ad_images)
          ? req.body.ad_images
          : [],
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    res.json(updatedAds);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update advertisements",
      error: error.message,
    });
  }
});

module.exports = router;
