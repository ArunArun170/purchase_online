const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Ad = require("./models/Ad");

const adsPath = path.join(
  __dirname,
  "data",
  "ads.json"
);

async function importAds() {
  try {
    const adsData = JSON.parse(
      fs.readFileSync(adsPath, "utf-8")
    );

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    const importedAds = await Ad.findOneAndUpdate(
      { key: "homepage" },
      {
        key: "homepage",
        testimonial: adsData.testimonial || {},
        mid_image: adsData.mid_image || {},
        ad_images: Array.isArray(adsData.ad_images)
          ? adsData.ad_images
          : [],
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(
      `Homepage advertisements imported successfully (${importedAds.ad_images.length} ad images)`
    );

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Advertisement import failed:");
    console.error(error.message);

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

importAds();
