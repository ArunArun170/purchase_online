const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    qty: { type: Number, required: true, min: 1 },
    color: { type: String, default: null },
    size: { type: String, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true, index: true },
    customer_name: { type: String, default: "Customer" },
    customer_email: { type: String, default: "" },
    customer_phone: { type: String, default: "" },
    items: { type: [orderItemSchema], default: [] },
    total_items: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total_price: { type: Number, default: 0 },
    payment_method: { type: String, default: "Cash on Delivery" },
    status: { type: String, default: "Processing" },
    date: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
