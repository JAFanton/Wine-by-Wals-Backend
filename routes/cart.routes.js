const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart.model");
const Wine = require("../models/Wine.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//GET request to /cart, fetch current user's cart
router.get("/", isAuthenticated, (req, res) => {
    Cart.findOne({ user: req.payload._id })
    .populate("items.wine")
    .then(cart => {
        if(!cart) {
            return Cart.create({ user: req.payload._id, items: [] })
            .then(newCart => newCart.populate("items.wine"))
            .then(populatedCart => res.status(200).json({ cart: populatedCart}));
        }
        res.status(200).json({ cart });
    })
    .catch((error) => res.status(500).json({ error: "Failed to fetch cart", details: error.message }));
});

//POST request to /cart, add wine to cart or increase quantity
router.post("/", isAuthenticated, (req, res) => {
  const { wineId, quantity = 1 } = req.body;
  if (!wineId) return res.status(400).json({ error: "Wine ID is required" });

  Wine.findById(wineId)
    .then(wine => {
      if (!wine) return Promise.reject({ status: 404, message: "Wine not found" });

      return Cart.findOne({ user: req.payload._id }).then(cart => {
        if (!cart) cart = new Cart({ user: req.payload._id, items: [] });

        const existingItem = cart.items.find(item => item.wine.equals(wineId));
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ wine: wineId, quantity });
        }

        return cart.save().then(savedCart => savedCart.populate("items.wine"));
      });
    })
    .then(cart => res.status(200).json({ cart }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || "Failed to add wine to cart" }));
});

//PUT request to /cart/:wineId, update quantity
router.put("/:wineId", isAuthenticated, (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });

  Cart.findOne({ user: req.payload._id })
    .then(cart => {
      if (!cart) return Promise.reject({ status: 404, message: "Cart not found" });

      const item = cart.items.find(item => item.wine.equals(req.params.wineId));
      if (!item) return Promise.reject({ status: 404, message: "Wine not found in cart" });

      item.quantity = quantity;
      return cart.save().then(savedCart => savedCart.populate("items.wine"));
    })
    .then(cart => res.status(200).json({ cart }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || "Failed to update cart" }));
});

// DELETE /cart/:wineId - Remove wine
router.delete("/:wineId", isAuthenticated, (req, res) => {
  Cart.findOne({ user: req.payload._id })
    .then(cart => {
      if (!cart) return Promise.reject({ status: 404, message: "Cart not found" });

      cart.items = cart.items.filter(item => !item.wine.equals(req.params.wineId));
      return cart.save().then(savedCart => savedCart.populate("items.wine"));
    })
    .then(cart => res.status(200).json({ cart }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || "Failed to remove wine from cart" }));
});

// POST /cart/discount - Apply discount code
router.post("/discount", isAuthenticated, (req, res) => {
  const { code, amount } = req.body;

  if (req.payload.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only." });
  }

  if (!code || !amount) return res.status(400).json({ error: "Discount code and amount are required" });

  Cart.findOne({ user: req.payload._id })
    .then(cart => {
      if (!cart) return Promise.reject({ status: 404, message: "Cart not found" });

      cart.discountCode = code;
      cart.discountAmount = amount;
      return cart.save().then(savedCart => savedCart.populate("items.wine"));
    })
    .then(cart => res.status(200).json({ cart }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || "Failed to apply discount" }));
});

module.exports = router;