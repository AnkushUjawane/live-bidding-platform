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
    endTime: Date.now() + 10 * 60 * 1000 // 10 minutes
  },
  {
    id: "2",
    title: "iPhone Pro",
    startingPrice: 600,
    currentBid: 600,
    highestBidder: null,
    lastBidder: null,
    status: "UPCOMING",
    startTime: Date.now() + 2 * 60 * 1000, // starts in 2 minutes
    endTime: Date.now() + 12 * 60 * 1000 // ends 10 minutes after start
  },
  {
    id: "3",
    title: "Samsung Galaxy",
    startingPrice: 400,
    currentBid: 400,
    highestBidder: null,
    lastBidder: null,
    status: "UPCOMING",
    startTime: Date.now() + 3 * 60 * 1000, // starts in 3 minutes
    endTime: Date.now() + 13 * 60 * 1000 // ends 10 minutes after start
  },
  {
    id: "4",
    title: "Gaming Laptop",
    startingPrice: 800,
    currentBid: 800,
    highestBidder: null,
    lastBidder: null,
    status: "LIVE",
    startTime: Date.now(),
    endTime: Date.now() + 12 * 60 * 60 * 1000 // 12 hours
  },
  {
    id: "5",
    title: "iPad Pro",
    startingPrice: 300,
    currentBid: 300,
    highestBidder: null,
    lastBidder: null,
    status: "LIVE",
    startTime: Date.now(),
    endTime: Date.now() + 12 * 60 * 60 * 1000 // 12 hours
  }
];
