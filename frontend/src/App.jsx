import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "./components/ItemCard";

function App() {
  const [items, setItems] = useState([]);
  const [serverOffset, setServerOffset] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9000/items")
      .then(res => {
        const serverTime = Number(res.data.serverTime);
        setServerOffset(serverTime - Date.now());
        setItems(res.data.items);
      })
      .catch(console.error);
  }, []);

  if (serverOffset === null) {
    return <h2>Loading auction...</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Auction</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20
        }}
      >
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            serverOffset={serverOffset}
          />
        ))}
      </div>
    </div>
  );
}

export default App;