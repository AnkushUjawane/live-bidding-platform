import { useEffect, useState } from "react";

export default function CountdownTimer({
  status,
  startTime,
  endTime,
  serverOffset
}) {
  const getTimeLeft = () => {
    const now = Date.now() + serverOffset;

    if (status === "UPCOMING") {
      return Math.max(0, startTime - now);
    }

    if (status === "LIVE") {
      return Math.max(0, endTime - now);
    }

    return 0;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const i = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(i);
  }, [status, startTime, endTime, serverOffset]);

  if (status === "ENDED") {
    return <strong style={{ color: "#e53e3e" }}>❌ Auction Ended</strong>;
  }

  if (timeLeft <= 0 && status === "UPCOMING") {
    return <strong style={{ color: "#4facfe" }}>Starting...</strong>;
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <span style={{
      fontSize: "0.85rem",
      fontWeight: "600",
      color: status === "LIVE" ? "#e53e3e" : status === "UPCOMING" ? "#4facfe" : "#718096"
    }}>
      {status === "UPCOMING" && "⏳ Starts in "}
      {status === "LIVE" && "🔥 Ends in "}
      {hours > 0 && `${hours}h `}
      {minutes}m {String(seconds).padStart(2, "0")}s
    </span>
  );
}