import { useEffect, useState, useRef } from "react";
import { socket } from "../hooks/useSocket";
import CountdownTimer from "./CountdownTimer";

export default function ItemCard({ item, userId, serverOffset }) {
    const [price, setPrice] = useState(item.currentBid);
    const [status, setStatus] = useState("idle");
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [flash, setFlash] = useState(null);
    const auctionEndedRef = useRef(false);

    useEffect(() => {
        socket.on("UPDATE_BID", updated => {
            if (updated.id !== item.id) return;
            if (auctionEndedRef.current) return;

            setPrice(updated.currentBid);

            if (updated.highestBidder === userId) {
                setStatus("winning");
                setFlash("green");
            } else {
                setStatus("outbid");
                setFlash("red");
            }

            setTimeout(() => {
                setFlash(null);
                setStatus("");
            }, 600);
        });

        socket.on("BID_ERROR", ({ itemId }) => {
            if (itemId !== item.id) return;
            setStatus("outbid");
            setFlash("red");
            setTimeout(() => {
                setFlash(null);
                setStatus("");
            }, 600);
        });

        socket.on("AUCTION_ENDED", ({ itemId }) => {
            if (itemId !== item.id) return;
            auctionEndedRef.current = true;
            setAuctionEnded(true);
        });

        return () => {
            socket.off("UPDATE_BID");
            socket.off("BID_ERROR");
            socket.off("AUCTION_ENDED");
        };
    }, [item.id, userId]);

    const bid = () => {
        if (auctionEnded) return;
        const newBid = price + 10;
        setStatus("winning");
        setFlash("green");
        setTimeout(() => {
            setFlash(null);
            setStatus("");
        }, 600);
        socket.emit("BID_PLACED", {
            itemId: item.id,
            bidAmount: newBid,
            userId
        });
    };

    return (
        <div className={`card ${auctionEnded ? "ended" : ""}`}>

            {/* Header */}
            <div className="card-header">
                <h3 className="item-title">{item.title}</h3>
                <CountdownTimer
                    endTime={Number(item.endTime)}
                    serverOffset={serverOffset}
                />
            </div>

            {/* Price */}
            <div
                className={`price ${flash === "green" ? "flash-green" : ""} ${flash === "red" ? "flash-red" : ""
                    }`}
            >
                ${price}
            </div>

            {/* CTA */}
            <button className="bid-btn" onClick={bid} disabled={auctionEnded}>
                {auctionEnded ? "Auction Ended" : "Place Bid  +$10"}
            </button>

            {/* Status */}
            <div className="status">
                {status === "winning" && <span className="win">🏆 Winning</span>}
                {status === "outbid" && <span className="lose">❌ Outbid</span>}
            </div>

        </div>
    );
}