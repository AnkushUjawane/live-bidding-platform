const ONE_HOUR = 60 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

module.exports = [
  {
    id: "1",
    title: "MacBook Pro",
    startingPrice: 500,
    currentBid: 500,
    highestBidder: null,
    createdAt: Date.now(),
    startAfter: 0,             
    duration: TWELVE_HOURS,
    ended: false
  },

  {
    id: "2",
    title: "iPhone Pro",
    startingPrice: 600,
    currentBid: 600,
    highestBidder: null,
    createdAt: Date.now(),
    startAfter: ONE_HOUR,       
    duration: TWELVE_HOURS,
    ended: false
  },

  {
    id: "3",
    title: "Oppo",
    startingPrice: 700,
    currentBid: 700,
    highestBidder: null,
    createdAt: Date.now(),
    startAfter: 2 * ONE_HOUR,    
    duration: TWELVE_HOURS,
    ended: false
  }
];