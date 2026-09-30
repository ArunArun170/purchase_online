const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
      default: null,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    badge: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    hoverImage: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    available: {
      type: Number,
      default: 0,
    },

    colors: {
      type: [
        {
          name: String,
          hex: String,
        },
      ],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);