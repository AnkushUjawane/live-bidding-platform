import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

export default function Register({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, email, parseFloat(balance));
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="number" placeholder="Initial Balance ($)" value={balance} onChange={e => setBalance(e.target.value)} required />
        <button type="submit">Register</button>
        <p onClick={onSwitch}>Already have an account? Login</p>
      </form>
    </div>
  );
}
