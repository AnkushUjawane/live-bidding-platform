const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { verifyToken, SECRET } = require("../utils/auth");

const router = express.Router();
const usersFile = path.join(__dirname, "../data/users.json");

const getUsers = () => JSON.parse(fs.readFileSync(usersFile, "utf8"));
const saveUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

// Register
router.post("/register", async (req, res) => {
  const { username, password, email, balance } = req.body;
  
  if (!username || !password || !email || balance === undefined) {
    return res.status(400).json({ error: "All fields required" });
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    email,
    balance: parseFloat(balance)
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ userId: newUser.id }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: newUser.id, username, email, balance: newUser.balance } });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  const users = getUsers();
  const user = users.find(u => u.username === username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, balance: user.balance } });
});

// Get Profile
router.get("/profile", verifyToken, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.userId);
  
  if (!user) return res.status(404).json({ error: "User not found" });
  
  res.json({ id: user.id, username: user.username, email: user.email, balance: user.balance });
});

module.exports = router;
