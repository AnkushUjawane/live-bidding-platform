const items = require("./data/items");
const mutex = require("./utils/mutex");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    socket.on("BID_PLACED", async ({ itemId, bidAmount, userId }) => {
      await mutex.runExclusive(() => {
        const item = items.find(i => i.id === itemId);
        if(!item){
            return;
        };
        if(Date.now() > item.endTime) {
          socket.emit("BID_ERROR", { message: "Auction ended" });
          return;
        }

        if(bidAmount <= item.currentBid) {
          socket.emit("BID_ERROR", { message: "Outbid" });
          return;
        }
        item.currentBid = bidAmount;
        item.highestBidder = userId;
        io.emit("UPDATE_BID", item);
      });
    });
  });
};