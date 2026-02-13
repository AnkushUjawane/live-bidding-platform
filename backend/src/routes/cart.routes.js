const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("../utils/auth");

const router = express.Router();
const cartsFile = path.join(__dirname, "../data/carts.json");
const usersFile = path.join(__dirname, "../data/users.json");
const purchasesFile = path.join(__dirname, "../data/purchases.json");

const getCarts = () => JSON.parse(fs.readFileSync(cartsFile, "utf8"));
const saveCarts = (carts) => fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
const getUsers = () => JSON.parse(fs.readFileSync(usersFile, "utf8"));
const saveUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
const getPurchases = () => JSON.parse(fs.readFileSync(purchasesFile, "utf8"));
const savePurchases = (purchases) => fs.writeFileSync(purchasesFile, JSON.stringify(purchases, null, 2));

// Get user's cart
router.get("/", verifyToken, (req, res) => {
  const carts = getCarts();
  const userCart = carts.filter(c => c.userId === req.userId && !c.purchased);
  res.json(userCart);
});

// Add won item to cart (called by socket when auction ends)
router.post("/add", verifyToken, (req, res) => {
  const { itemId, title, finalBid } = req.body;
  
  const carts = getCarts();
  carts.push({
    id: Date.now().toString(),
    userId: req.userId,
    itemId,
    title,
    price: finalBid,
    purchased: false,
    addedAt: new Date().toISOString()
  });
  saveCarts(carts);
  
  res.json({ message: "Item added to cart" });
});

// Purchase items from cart
router.post("/purchase", verifyToken, (req, res) => {
  const { cartItemIds } = req.body;
  
  const carts = getCarts();
  const users = getUsers();
  const purchases = getPurchases();
  const user = users.find(u => u.id === req.userId);
  
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const itemsToPurchase = carts.filter(c => cartItemIds.includes(c.id) && c.userId === req.userId && !c.purchased);
  const totalCost = itemsToPurchase.reduce((sum, item) => sum + item.price, 0);
  
  if (user.balance < totalCost) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  
  user.balance -= totalCost;
  itemsToPurchase.forEach(item => {
    const cartItem = carts.find(c => c.id === item.id);
    if (cartItem) cartItem.purchased = true;
    
    purchases.push({
      id: Date.now().toString() + Math.random(),
      userId: req.userId,
      itemId: item.itemId,
      title: item.title,
      price: item.price,
      purchasedAt: new Date().toISOString()
    });
  });
  
  saveUsers(users);
  saveCarts(carts);
  savePurchases(purchases);
  
  res.json({ message: "Purchase successful", newBalance: user.balance });
});

// Remove item from cart
router.delete("/:cartItemId", verifyToken, (req, res) => {
  const carts = getCarts();
  const filtered = carts.filter(c => !(c.id === req.params.cartItemId && c.userId === req.userId));
  saveCarts(filtered);
  res.json({ message: "Item removed" });
});

// Get user's purchase history
router.get("/purchases", verifyToken, (req, res) => {
  const purchases = getPurchases();
  const userPurchases = purchases.filter(p => p.userId === req.userId);
  res.json(userPurchases);
});

module.exports = router;
