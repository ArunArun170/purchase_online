const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Order = require("./models/Order");

const filePath = path.join(__dirname, "data", "order.json");

const normalizeOrder = (order) => ({
  order_id: order.id || order.order_id,
  customer_name: order.customer_name || order.customer?.name || "Customer",
  customer_email: order.customer_email || order.customer?.email || "",
  customer_phone: order.customer_phone || order.customer?.phone || "",
  items: Array.isArray(order.items)
    ? order.items.map((item) => ({
        id: String(item.id),
        name: item.name || "Product",
        price: Number(item.price || 0),
        image: item.image || "",
        qty: Number(item.qty || 1),
        color: item.color ?? null,
        size: item.size ?? null,
      }))
    : [],
  total_items: Number(order.total_items || 0),
  subtotal: Number(order.subtotal || 0),
  tax: Number(order.tax || 0),
  total_price: Number(
    order.total_price ?? order.total ?? order.total_amount ?? order.amount ?? 0
  ),
  payment_method: order.payment_method || "Cash on Delivery",
  status: order.status || "Processing",
  date: order.date || "",
});

const run = async () => {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const orders = JSON.parse(raw);

    if (!Array.isArray(orders)) {
      throw new Error("order.json must contain an array");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const normalized = orders
      .map(normalizeOrder)
      .filter((order) => order.order_id);

    for (const order of normalized) {
      await Order.updateOne(
        { order_id: order.order_id },
        { $set: order },
        { upsert: true }
      );
    }

    console.log(`Imported ${normalized.length} orders into MongoDB.`);
  } catch (error) {
    console.error("Order import failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
