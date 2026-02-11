import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./hooks/useSocket";
import ItemCard from "./components/ItemCard";
import "./App.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

function App() {
  const [items, setItems] = useState([]);
  const [serverOffset, setServerOffset] = useState(null);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    axios.get(`${API_URL}/items`)
      .then(res => {
        const serverTime = Number(res.data.serverTime);
        setServerOffset(serverTime - Date.now());
        setItems(res.data.items); 
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    socket.on("INIT_ITEMS", serverItems => {
      setItems(serverItems);
    });

    socket.on("UPDATE_BID", updated => {
      setItems(prev =>
        prev.map(i =>
          i.id === updated.id
            ? {
                ...i,
                currentBid: updated.currentBid,
                highestBidder: updated.highestBidder,
                endTime: updated.endTime
              }
            : i
        )
      );
    });

    socket.on("AUCTION_EXTENDED", ({ itemId, newEndTime }) => {
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, endTime: newEndTime } : i
        )
      );
    });

    socket.on("AUCTION_ENDED", ({ itemId }) => {
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, status: "ENDED" } : i
        )
      );
    });

    return () => {
      socket.off("INIT_ITEMS");
      socket.off("UPDATE_BID");
      socket.off("AUCTION_EXTENDED");
      socket.off("AUCTION_ENDED");
    };
  }, []);

  if (!items.length) {
    return <div className="loading">No auctions available</div>;
  }

  if (serverOffset === null) {
    return <div className="loading">Loading auction...</div>;
  }

  return (
    <div className="container">
      <div className="wrapper">
        <div className="header">
          <h1 className="title">🔥 Live Auction Platform</h1>
          <p className="userId">User: {userId}</p>
        </div>

        <div className="grid">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              userId={userId}
              serverOffset={serverOffset}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;