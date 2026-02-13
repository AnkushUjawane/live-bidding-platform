const items = require("./data/items");
const mutex = require("./utils/mutex");
const fs = require("fs");
const path = require("path");

const cartsFile = path.join(__dirname, "data/carts.json");
const getCarts = () => JSON.parse(fs.readFileSync(cartsFile, "utf8"));
const saveCarts = (carts) => fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));

const userLastBidTime = {};
const userItemBidTime = {};
const BID_COOLDOWN_MS = 3000;
const ANTI_SNIPING_THRESHOLD = 15000;
const ANTI_SNIPING_EXTENSION = 30000;

module.exports = (io) => {
  // Set up auction timers
  items.forEach(item => {
    const now = Date.now();
    
    // Set initial status based on current time
    if (now < item.startTime) {
      item.status = "UPCOMING";
    } else if (now >= item.startTime && now < item.endTime) {
      item.status = "LIVE";
    } else {
      item.status = "ENDED";
      item.ended = true;
    }

    // Schedule auction start if upcoming
    if (item.status === "UPCOMING") {
      const startDelay = item.startTime - now;
      setTimeout(() => {
        item.status = "LIVE";
        io.emit("AUCTION_STARTED", { itemId: item.id });
      }, startDelay);
    }

    // Schedule auction end
    if (item.status === "LIVE") {
      const endDelay = item.endTime - now;
      setTimeout(() => {
        item.status = "ENDED";
        item.ended = true;
        
        // Add to winner's cart
        if (item.highestBidder) {
          const carts = getCarts();
          carts.push({
            id: Date.now().toString() + Math.random(),
            userId: item.highestBidder,
            itemId: item.id,
            title: item.title,
            price: item.currentBid,
            purchased: false,
            addedAt: new Date().toISOString()
          });
          saveCarts(carts);
        }
        
        io.emit("AUCTION_ENDED", { itemId: item.id, winner: item.highestBidder });
      }, endDelay);
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
          userItemBidTime[`${userId}_${itemId}`] &&
          now - userItemBidTime[`${userId}_${itemId}`] < BID_COOLDOWN_MS
        ) {
          socket.emit("BID_ERROR", { itemId, reason: "BID_COOLDOWN" });
          return;
        }
        
        // Anti-sniping: extend auction if bid placed in final seconds
        if (item.endTime - now <= ANTI_SNIPING_THRESHOLD) {
          item.endTime += ANTI_SNIPING_EXTENSION;
          io.emit("AUCTION_EXTENDED", {
            itemId: item.id,
            newEndTime: item.endTime
          });
        }
        
        // Update bid
        item.currentBid = bidAmount;
        item.highestBidder = userId;
        userLastBidTime[userId] = now;
        userItemBidTime[`${userId}_${itemId}`] = now;
        
        // Broadcast update to all clients
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