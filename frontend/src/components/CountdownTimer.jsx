import { useEffect, useState } from "react";

export default function CountdownTimer({ endTime, serverOffset }) {
  const getTimeLeft = () => {
    const now = Date.now() + serverOffset;
    return Math.max(0, endTime - now);
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const i = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(i);
  }, [endTime, serverOffset]);

  if (timeLeft <= 0) {
    return <strong>Auction Ended</strong>;
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <span>
      ⏳ {minutes}:{String(seconds).padStart(2, "0")}
    </span>
  );
}