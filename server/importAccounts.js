const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

const filePath = path.join(__dirname, "data", "account.json");

function getRecords(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.accounts)) return data.accounts;
  if (Array.isArray(data.users)) return data.users;
  return [];
}

async function run() {
  try {
    const records = getRecords(JSON.parse(fs.readFileSync(filePath, "utf8")));
    await mongoose.connect(process.env.MONGO_URI);
    for (const record of records) {
      const email = String(record.email || "").trim().toLowerCase();
      if (!email) continue;
      const existing = await User.findOne({ email });
      if (existing) continue;
      const plainPassword = record.password || "admin123";
      const passwordHash = record.passwordHash || await bcrypt.hash(plainPassword, 12);
      await User.create({
        name: record.name || record.username || email.split("@")[0],
        phone: record.phone || "",
        email,
        passwordHash,
        role: record.role || (email === "admin@gmail.com" ? "admin" : "customer"),
      });
    }
    // Ensure the known seed admin has admin privileges if it already existed.
    await User.updateOne({ email: "admin@gmail.com" }, { $set: { role: "admin" } });
    console.log(`Account import completed. Processed ${records.length} records.`);
  } catch (error) {
    console.error("Account import failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
run();
