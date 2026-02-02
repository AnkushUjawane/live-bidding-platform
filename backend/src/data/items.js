module.exports = [
  {
    id: "1",
    title: "MacBook Pro",
    startingPrice: 500,
    currentBid: 500,
    highestBidder: null,
    lastBidder: null,
    status: "LIVE",
    startTime: Date.now(),
    endTime: Date.now() + 12 * 60 * 60 * 1000
  },
  {
    id: "2",
    title: "iPhone Pro",
    startingPrice: 600,
    currentBid: 600,
    highestBidder: null,
    lastBidder: null,
    status: "UPCOMING",
    startTime: Date.now() + 1 * 60 * 60 * 1000,
    endTime: Date.now() + 13 * 60 * 60 * 1000
  },
  {
    id: "3",
    title: "Oppo",
    startingPrice: 700,
    currentBid: 700,
    highestBidder: null,
    lastBidder: null,
    status: "UPCOMING",
    startTime: Date.now() + 2 * 60 * 60 * 1000,
    endTime: Date.now() + 14 * 60 * 60 * 1000
  }
];
