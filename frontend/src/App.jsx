import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { socket } from "./hooks/useSocket";
import ItemCard from "./components/ItemCard";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

function App() {
  const [items, setItems] = useState([]);
  const [serverOffset, setServerOffset] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const { user, logout } = useContext(AuthContext);

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

  if (!user) {
    return showLogin ? 
      <Login onSwitch={() => setShowLogin(false)} /> : 
      <Register onSwitch={() => setShowLogin(true)} />;
  }

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
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="balance">${user.balance?.toFixed(2)}</span>
            <button className="cart-btn" onClick={() => setShowCart(true)}>🛒 Cart</button>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="grid">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              userId={user.id}
              serverOffset={serverOffset}
            />
          ))}
        </div>
      </div>
      
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
}

export default App;