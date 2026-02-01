const items = require("./data/items");
const mutex = require("./utils/mutex");

const userLastBidTime = {};
const BID_COOLDOWN_MS = 3000;
const ANTI_SNIPING_THRESHOLD = 15000;
const ANTI_SNIPING_EXTENSION = 30000;

module.exports = (io) => {
  items.forEach(item => {
    const timeLeft = item.endTime - Date.now();
    if (timeLeft > 0) {
      setTimeout(() => {
        item.status = "ENDED";
        item.ended = true;
        io.emit("AUCTION_ENDED", { itemId: item.id });
      }, timeLeft);
    } else {
      item.status = "ENDED";
      item.ended = true;
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    socket.emit("INIT_ITEMS", items);
    socket.on("BID_PLACED", async ({ itemId, bidAmount, userId }) => {
      await mutex.runExclusive(() => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const now = Date.now();
        if (item.ended || item.status === "ENDED") {
          socket.emit("BID_ERROR", { itemId, reason: "AUCTION_ENDED" });
          return;
        }
        if (item.status !== "LIVE") {
          socket.emit("BID_ERROR", { itemId, reason: "AUCTION_NOT_LIVE" });
          return;
        }
        if (item.highestBidder === userId) {
          socket.emit("BID_ERROR", { itemId, reason: "CONSECUTIVE_BID" });
          return;
        }
        if (bidAmount <= item.currentBid) {
          socket.emit("BID_ERROR", { itemId, reason: "OUTBID" });
          return;
        }
        if (
          userLastBidTime[userId] &&
          now - userLastBidTime[userId] < BID_COOLDOWN_MS
        ) {
          socket.emit("BID_ERROR", { itemId, reason: "BID_COOLDOWN" });
          return;
        }
        if (item.endTime - now <= ANTI_SNIPING_THRESHOLD) {
          item.endTime += ANTI_SNIPING_EXTENSION;
          io.emit("AUCTION_EXTENDED", {
            itemId: item.id,
            newEndTime: item.endTime
          });
        }
        item.currentBid = bidAmount;
        item.highestBidder = userId;
        userLastBidTime[userId] = now;
        io.emit("UPDATE_BID", {
          id: item.id,
          currentBid: item.currentBid,
          highestBidder: item.highestBidder,
          endTime: item.endTime
        });
      });
    });
  });
};