const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const heroSlideRoutes = require("./routes/heroSlideRoutes");
const adRoutes = require("./routes/adRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce Backend API is running",
  });
});

// Product API
app.use(
  "/api/products",
  productRoutes
);

// Category API
app.use(
  "/api/categories",
  categoryRoutes
);

// Hero Slide API
app.use(
  "/api/hero-slides",
  heroSlideRoutes
);

// Advertisement API
app.use(
  "/api/ads",
  adRoutes
);

// Order API
app.use("/api/orders", orderRoutes);

// Authentication API
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(error.message);
  });