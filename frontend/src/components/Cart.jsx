import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Cart.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

export default function Cart({ onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("cart");
  const { token, user, updateBalance } = useContext(AuthContext);

  useEffect(() => {
    fetchCart();
    fetchPurchases();
  }, []);

  const fetchCart = async () => {
    const res = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems(res.data);
  };

  const fetchPurchases = async () => {
    const res = await axios.get(`${API_URL}/cart/purchases`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPurchases(res.data);
  };

  const handlePurchase = async () => {
    if (selected.length === 0) return alert("Select items to purchase");
    
    try {
      const res = await axios.post(`${API_URL}/cart/purchase`, 
        { cartItemIds: selected },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert(res.data.message);
      updateBalance(res.data.newBalance);
      fetchCart();
      fetchPurchases();
      setSelected([]);
    } catch (err) {
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  const handleRemove = async (id) => {
    await axios.delete(`${API_URL}/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
  };

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalCost = cartItems
    .filter(item => selected.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 My Cart</h2>
          <button onClick={onClose}>✕</button>
        </div>
        
        <div className="cart-tabs">
          <button 
            className={activeTab === "cart" ? "active" : ""}
            onClick={() => setActiveTab("cart")}
          >
            Won Items ({cartItems.length})
          </button>
          <button 
            className={activeTab === "purchases" ? "active" : ""}
            onClick={() => setActiveTab("purchases")}
          >
            Purchased ({purchases.length})
          </button>
        </div>
        
        <div className="cart-balance">Balance: ${user?.balance?.toFixed(2)}</div>
        
        {activeTab === "cart" ? (
          cartItems.length === 0 ? (
            <p className="empty-cart">No items in cart</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <input 
                      type="checkbox" 
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                    <div className="cart-item-info">
                      <h3>{item.title}</h3>
                      <p>${item.price}</p>
                    </div>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">Total: ${totalCost.toFixed(2)}</div>
                <button 
                  className="purchase-btn" 
                  onClick={handlePurchase}
                  disabled={selected.length === 0}
                >
                  Purchase Selected
                </button>
              </div>
            </>
          )
        ) : (
          purchases.length === 0 ? (
            <p className="empty-cart">No purchases yet</p>
          ) : (
            <div className="cart-items">
              {purchases.map(item => (
                <div key={item.id} className="purchase-item">
                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <p className="price">${item.price}</p>
                    <p className="date">{new Date(item.purchasedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="purchased-badge">✓ Purchased</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
