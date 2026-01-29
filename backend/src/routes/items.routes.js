const express = require("express");
const items = require("../data/items");
const router = express.Router();

router.get("/", (req, res) => {
  const now = Date.now();

  const enrichedItems = items.map(item => {
    const startTime = item.createdAt + item.startAfter;
    const endTime = startTime + item.activeDuration;

    let status = "UPCOMING";
    if (now >= startTime && now < endTime) status = "LIVE";
    if (now >= endTime) status = "ENDED";

    return {
      ...item,
      startTime,
      endTime,
      status
    };
  });

  res.json({
    serverTime: now,
    items: enrichedItems
  });
});

module.exports = router;