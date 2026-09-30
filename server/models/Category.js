const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    show_in_scrollbar: {
      type: Boolean,
      default: false,
    },

    show_in_sidebar: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const categorySchema = new mongoose.Schema(
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

    icon: {
      type: String,
      default: "shirt-outline",
    },

    image: {
      type: String,
      default: "",
    },

    show_in_scrollbar: {
      type: Boolean,
      default: true,
    },

    show_in_sidebar: {
      type: Boolean,
      default: true,
    },

    subcategories: {
      type: [subcategorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);