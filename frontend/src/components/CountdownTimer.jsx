function formatTime(ms) {
  if (ms <= 0) return "0s";

  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

export default function CountdownTimer({
  status,
  startTime,
  endTime,
  serverOffset
}) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const t = setInterval(() => forceUpdate(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = Date.now() + serverOffset;

  if (status === "UPCOMING") {
    return <span>⏳ {formatTime(startTime - now)}</span>;
  }

  if (status === "LIVE") {
    return <span>🔥 {formatTime(endTime - now)}</span>;
  }

  return <span>❌ Ended</span>;
}