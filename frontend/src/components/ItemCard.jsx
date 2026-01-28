import { useEffect, useState } from "react";
import { socket } from "../hooks/useSocket";
import CountdownTimer from "./CountdownTimer";

export default function ItemCard({ item, serverOffset }) {
    const [price, setPrice] = useState(item.currentBid);
    const [status, setStatus] = useState("idle");
    const userId = localStorage.getItem("userId") || crypto.randomUUID();

    useEffect(() => {
        localStorage.setItem("userId", userId);

        socket.on("UPDATE_BID", updated => {
            if(updated.id !== item.id){
                return;
            }
            setPrice(updated.currentBid);
            if(updated.highestBidder === userId){
                setStatus("winning");
            } 
            else{
                setStatus("outbid");
            }
            setTimeout(() => setStatus("idle"), 600);
        });

        socket.on("BID_ERROR", err => {
            setStatus("outbid");
        });

        return () => {
            socket.off("UPDATE_BID");
            socket.off("BID_ERROR");
        };
    }, []);

    const bid = () => {
        socket.emit("BID_PLACED", {
            itemId: item.id,
            bidAmount: price + 10,
            userId
        });
    };

    return (
        <div className={`card ${status === "winning" ? "flash-green" : status === "outbid" ? "flash-red" : ""}`}>
            <h3>{item.title}</h3>
            <h2>${price}</h2>
            <CountdownTimer
                endTime={Number(item.endTime)}
                serverOffset={serverOffset}
            />
            <button onClick={bid}>Bid +$10</button>
            {status === "winning" && (
                <div className="badge win">🏆 Winning</div>
            )}
            {status === "outbid" && (
                <div className="badge outbid">❌ Outbid</div>
            )}
        </div>
    );
}