import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "./components/ItemCard";

function App() {
  const [items, setItems] = useState([]);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const userId = crypto.randomUUID();

  useEffect(() => {
    axios.get("http://localhost:9000/items")
      .then(res => {
        const { serverTime, items } = res.data;
        setServerTimeOffset(serverTime - Date.now());
        setItems(items);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Auction</h1>
      <div style={{ display: "grid", gap: 20 }}>
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            userId={userId}
            serverOffset={serverTimeOffset}
          />
        ))}
      </div>
    </div>
  );
}

export default App;