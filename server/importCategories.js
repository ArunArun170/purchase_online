const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Category = require("./models/Category");
const HeroSlide = require("./models/HeroSlide");

const databasePath = path.join(
  __dirname,
  "data",
  "database.json"
);

async function importCategoriesAndSlides() {
  try {
    const databaseData = JSON.parse(
      fs.readFileSync(databasePath, "utf-8")
    );

    const categories =
      databaseData.categories || [];

    const heroSlides =
      databaseData.hero_slides || [];

    console.log(
      `Found ${categories.length} categories`
    );

    console.log(
      `Found ${heroSlides.length} hero slides`
    );

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

    // Clear old categories
    await Category.deleteMany({});

    console.log(
      "Existing categories cleared"
    );

    // Import categories
    if (categories.length > 0) {
      await Category.insertMany(categories);

      console.log(
        `${categories.length} categories imported successfully`
      );
    }

    // Clear old hero slides
    await HeroSlide.deleteMany({});

    console.log(
      "Existing hero slides cleared"
    );

    // Add IDs to old hero slides
    const slidesWithIds = heroSlides.map(
      (slide, index) => ({
        ...slide,
        id:
          slide.id ||
          `hero-slide-${index + 1}`,
      })
    );

    if (slidesWithIds.length > 0) {
      await HeroSlide.insertMany(
        slidesWithIds
      );

      console.log(
        `${slidesWithIds.length} hero slides imported successfully`
      );
    }

    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed"
    );

    console.log(
      "Category and hero slide import completed successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Category and hero slide import failed:"
    );

    console.error(error.message);

    await mongoose.connection
      .close()
      .catch(() => {});

    process.exit(1);
  }
}

importCategoriesAndSlides();