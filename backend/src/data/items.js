module.exports = [
  {
    id: "1",
    title: "MacBook Pro",
    startingPrice: 500,
    currentBid: 500,
    highestBidder: null,

    createdAt: Date.now(),
    startAfter: 0,              // starts immediately
    activeDuration: 12 * 60 * 60 * 1000 // 12 hours
  },

  {
    id: "2",
    title: "iPhone Pro",
    startingPrice: 600,
    currentBid: 600,
    highestBidder: null,

    createdAt: Date.now(),
    startAfter: 1 * 60 * 60 * 1000, // starts after 1 hour
    activeDuration: 12 * 60 * 60 * 1000
  },

  {
    id: "3",
    title: "Oppo",
    startingPrice: 700,
    currentBid: 700,
    highestBidder: null,

    createdAt: Date.now(),
    startAfter: 2 * 60 * 60 * 1000, // starts after 2 hours
    activeDuration: 12 * 60 * 60 * 1000
  }
];