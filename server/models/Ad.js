const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    quote: { type: String, default: "" },
  },
  { _id: false }
);

const midImageSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    badge: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const adImageSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    title: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const adSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "homepage",
    },

    testimonial: {
      type: testimonialSchema,
      default: () => ({}),
    },

    mid_image: {
      type: midImageSchema,
      default: () => ({}),
    },

    ad_images: {
      type: [adImageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ad", adSchema);
