const { Router } = require("express");
const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model")
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = Router();

//POST request to /orders/checkout, create an order from current user's cart
router.post("/checkout", isAuthenticated, (req, res) => {
  Cart.findOne({ user: req.payload._id })
    .populate("items.wine")
    .then(cart => {
      if (!cart || cart.items.length === 0) {
        return Promise.reject({ status: 400, message: "Cart is empty" });
      }

      const totalPrice = cart.items.reduce(
        (sum, item) => sum + (item.wine.price || 0) * item.quantity,
        0
      ) - (cart.discountAmount || 0);

      return Order.create({
        user: req.payload._id,
        items: cart.items.map(item => ({ wine: item.wine._id, quantity: item.quantity })),
        totalPrice,
      }).then(order => {
        // Clear the cart after checkout
        cart.items = [];
        cart.discountCode = "";
        cart.discountAmount = 0;
        return cart.save().then(() => order.populate("items.wine"));
      });
    })
    .then(order => res.status(201).json({ order }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || "Failed to create order" }));
});

//POST request to /orders/:id/pay, temporary stub to simulate payment. 
// [Must replace with actual payment functionality once MVP is achieved]
router.post("/:id/pay", isAuthenticated, (req, res) => {
  const orderId = req.params.id;

  Order.findById(orderId)
    .then(order => {
      if (!order) return Promise.reject({ status: 404, message: "Order not found" });
      if (!order.user.equals(req.payload._id)) return Promise.reject({ status: 403, message: "Not authorized" });

      order.paid = true;
      order.status = "processed"; // automatically mark as processed for simplicity
      return order.save().then(savedOrder => savedOrder.populate("items.wine"));
    })
    .then(order => res.status(200).json({ order }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || "Failed to process payment" }));
});

//GET request to /orders, fetch orders for the logged-in user
router.get("/", isAuthenticated, (req, res) => {
  Order.find({ user: req.payload._id })
    .populate("items.wine")
    .then(orders => res.status(200).json({ data: orders }))
    .catch(err => res.status(500).json({ error: "Failed to fetch orders", details: err }));
});

//GET request to /orders/all, fetch all orders (admin only)
router.get("/all", isAuthenticated, (req, res) => {
  if (req.payload.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  Order.find()
    .populate("items.wine")
    .populate("user", "name email")
    .then(orders => res.status(200).json({ data: orders }))
    .catch(err => res.status(500).json({ error: "Failed to fetch all orders", details: err }));
});

module.exports = router;