import { Router } from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Place order
router.post("/", requireAuth, async (req, res) => {
  const { items, total, name, address, paymentMode } = req.body;
  if (!items?.length || !total || !name || !address || !paymentMode) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const order = await Order.create({
    user: req.user.id,
    items,
    total,
    name,
    address,
    paymentMode,
  });
  await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
  res.status(201).json(order);

   // ---- AUTOMATIC STATUS UPDATES ----
  // After 10s → "Out for delivery"
  setTimeout(async () => {
    await Order.findByIdAndUpdate(order._id, { status: "Out for delivery" });
  }, 10000);

  // After 20s → "Delivered"
  setTimeout(async () => {
    await Order.findByIdAndUpdate(order._id, { status: "Delivered" });
  }, 20000);
});

// Get user's orders
router.get("/", requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.food");
  res.json(orders);
});

// Get single order by ID
router.get("/:id", requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.food");
  if (!order || order.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
});

// Update order status
router.patch("/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order || order.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.status = status;
  await order.save();
  res.json(order);
});

export default router;