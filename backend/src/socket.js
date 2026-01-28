const items = require("./data/items");
const mutex = require("./utils/mutex");

module.exports = (io) => {
  items.forEach(item => {
    const timeLeft = item.endTime - Date.now();
    if (timeLeft > 0) {
      setTimeout(() => {
        item.ended = true;
        io.emit("AUCTION_ENDED", { itemId: item.id });
      }, timeLeft);
    } else {
      item.ended = true;
      io.emit("AUCTION_ENDED", { itemId: item.id });
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    socket.on("BID_PLACED", async ({ itemId, bidAmount, userId }) => {
      await mutex.runExclusive(() => {
        const item = items.find(i => i.id === itemId);
        if (!item) {
          return;
        };
        if (item.ended) {
          socket.emit("BID_ERROR", { itemId: item.id, message: "Auction ended" });
          return;
        }

        if (bidAmount <= item.currentBid) {
          socket.emit("BID_ERROR", { itemId: item.id, message: "Outbid" });
          return;
        }
        item.currentBid = bidAmount;
        item.highestBidder = userId;
        io.emit("UPDATE_BID", {
          id: item.id,
          currentBid: item.currentBid,
          highestBidder: item.highestBidder
        });
      });
    });
  });
};