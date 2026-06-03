const Order = require("../models/Order");
const Food = require("../models/Food");

// ─── Create Order ─────────────────────────────────────────────────────────────
// POST /api/orders  (protected)
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must have at least one item." });
    }
    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: "Delivery address is required." });
    }

    // Verify each food item exists and build order items with price snapshots
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food) {
        return res.status(404).json({ success: false, message: `Food item not found: ${item.food}` });
      }
      if (!food.isAvailable) {
        return res.status(400).json({ success: false, message: `${food.name} is currently unavailable.` });
      }

      const orderItem = {
        food: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: item.quantity,
      };
      orderItems.push(orderItem);
      subtotal += food.price * item.quantity;
    }

    const deliveryFee = 49;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryFee + tax;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryFee,
      tax,
      deliveryAddress,
      paymentMethod: paymentMethod || "COD",
      paymentId: paymentId || null,
      status: "Pending",
    });

    res.status(201).json({ success: true, message: "Order placed successfully.", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get My Orders ────────────────────────────────────────────────────────────
// GET /api/orders/my  (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
// GET /api/orders/:id  (protected)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Users can only see their own orders; admins can see all
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this order." });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
// GET /api/orders  (admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name email phone");

    res.status(200).json({ success: true, total, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Order Status (Admin) ──────────────────────────────────────────────
// PUT /api/orders/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, message: `Order status updated to "${status}".`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Cancel Order (User) ──────────────────────────────────────────────────────
// PUT /api/orders/:id/cancel  (protected)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    if (["Delivered", "Cancelled", "Out for Delivery"].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is "${order.status}".` });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled.", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
