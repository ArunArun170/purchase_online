const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const databasePath = path.join(__dirname, "data", "database.json");

async function importProducts() {
  try {
    // Read database.json
    const databaseData = JSON.parse(
      fs.readFileSync(databasePath, "utf-8")
    );

    const products = databaseData.products || [];

    console.log(`Found ${products.length} products in database.json`);

    if (products.length === 0) {
      console.log("No products found.");
      process.exit(0);
    }

    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    // Remove existing products to avoid duplicate import
    await Product.deleteMany({});

    console.log("Existing products cleared");

    // Insert products
    const insertedProducts = await Product.insertMany(products);

    console.log(
      `${insertedProducts.length} products imported successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    console.log("Product import completed successfully");

    process.exit(0);
  } catch (error) {
    console.error("Product import failed:");
    console.error(error.message);

    await mongoose.connection.close().catch(() => {});

    process.exit(1);
  }
}

importProducts();