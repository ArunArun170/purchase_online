const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

const generateOrderId = () =>
  `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      customer,
      items = [],
      total_items,
      subtotal,
      tax,
      total,
      payment_method = "Cash on Delivery",
    } = req.body;

    if (!customer?.email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Customer email and at least one item are required",
      });
    }

    let orderId;
    do {
      orderId = generateOrderId();
    } while (await Order.exists({ order_id: orderId }));

    const now = new Date();

    const order = await Order.create({
      order_id: orderId,
      customer_name: customer.name || "Customer",
      customer_email: customer.email,
      customer_phone: customer.phone || "",
      items,
      total_items: Number(total_items || 0),
      subtotal: Number(subtotal || 0),
      tax: Number(tax || 0),
      total_price: Number(total || 0),
      payment_method,
      status: "Processing",
      date: now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

router.patch("/:orderId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { order_id: req.params.orderId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

router.delete("/:orderId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      order_id: req.params.orderId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
