const express = require("express");
const items = require("../data/items");
const router = express.Router();

router.get("/", (req, res) => {
  const now = Date.now();

  const processedItems = items.map(item => {
    const startTime = item.createdAt + item.startAfter;
    const endTime = startTime + item.duration;

    let status = "UPCOMING";

    if (now >= startTime && now < endTime) {
      status = "LIVE";
    }

    if (now >= endTime) {
      status = "ENDED";
      item.ended = true;
    }

    return {
      id: item.id,
      title: item.title,
      startingPrice: item.startingPrice,
      currentBid: item.currentBid,
      highestBidder: item.highestBidder,

      startTime,
      endTime,
      status
    };
  });

  res.json({
    serverTime: now,
    items: processedItems
  });
});

module.exports = router;