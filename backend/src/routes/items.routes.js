const express = require("express");
const items = require("../data/items");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    serverTime: Date.now(),
    items: items.map(item => ({
        id: item.id,
        title: item.title, 
        currentBid: item.currentBid,
        endTime: item.endTime
    }))
  });
});

module.exports = router;