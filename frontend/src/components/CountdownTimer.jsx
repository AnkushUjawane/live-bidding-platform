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
    return <strong>❌ Auction Ended</strong>;
  }

  if (timeLeft <= 0 && status === "UPCOMING") {
    return <strong>Starting...</strong>;
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <span>
      {status === "UPCOMING" && "⏳ Starts in "}
      {status === "LIVE" && "🔥 Ends in "}
      {hours > 0 && `${hours}h `}
      {minutes}m {String(seconds).padStart(2, "0")}s
    </span>
  );
}