import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./hooks/useSocket";
import ItemCard from "./components/ItemCard";

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
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        color: "white",
        fontSize: "1.5rem",
        fontWeight: "600"
      }}>
        No auctions available
      </div>
    );
  }

  if (serverOffset === null) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        color: "white",
        fontSize: "1.5rem",
        fontWeight: "600"
      }}>
        Loading auction...
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "800", 
            color: "white", 
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            marginBottom: "10px"
          }}>
            🔥 Live Auction Platform
          </h1>
          <p style={{ 
            color: "rgba(255,255,255,0.9)", 
            fontSize: "1.2rem",
            fontWeight: "500"
          }}>
            User: {userId}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px"
          }}
        >
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