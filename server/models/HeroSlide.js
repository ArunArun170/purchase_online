const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    image: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "HeroSlide",
  heroSlideSchema
);