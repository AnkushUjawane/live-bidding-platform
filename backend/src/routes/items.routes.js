const express = require("express");
const items = require("../data/items");
const router = express.Router();

router.get("/", (req, res) => {
  const now = Date.now();

  const enrichedItems = items.map(item => {
    let status = "UPCOMING";
    if (now >= item.startTime && now < item.endTime) status = "LIVE";
    if (now >= item.endTime) status = "ENDED";

    return {
      ...item,
      status
    };
  });

  res.json({
    serverTime: now,
    items: enrichedItems
  });
});

module.exports = router;