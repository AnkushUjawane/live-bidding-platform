const express = require("express");
const items = require("../data/items");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    serverTime: Date.now(),
    items
  });
});

module.exports = router;