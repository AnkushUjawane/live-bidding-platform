import { useEffect, useState } from "react";

export default function CountdownTimer({ endTime, offset }) {
  const [timeLeft, setTimeLeft] = useState(
    endTime - (Date.now() + offset)
  );

  useEffect(() => {
    const i = setInterval(() => {
      setTimeLeft(endTime - (Date.now() + offset));
    }, 1000);
    return () => clearInterval(i);
  }, [endTime, offset]);

  if (timeLeft <= 0) return <strong>Auction Ended</strong>;

  return <span>{Math.floor(timeLeft / 1000)}s left</span>;
}