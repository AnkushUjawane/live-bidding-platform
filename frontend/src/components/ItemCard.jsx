import { useEffect, useState, useRef } from "react";
import { socket } from "../hooks/useSocket";
import CountdownTimer from "./CountdownTimer";

export default function ItemCard({ item, userId, serverOffset }) {
    const [price, setPrice] = useState(item.currentBid);
    const [status, setStatus] = useState("");
    const [flash, setFlash] = useState(null);
    const auctionEndedRef = useRef(false);

    const auctionEnded = item.status === "ENDED";
    const isLive = item.status === "LIVE";

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

        socket.on("BID_ERROR", ({ itemId, reason }) => {
            if (itemId !== item.id) return;
            if (reason === "CONSECUTIVE_BID") {
                setStatus("outbid");
                alert("You cannot place two consecutive bids. Wait for another bidder.");
            }
            if (reason === "BID_COOLDOWN") {
                alert("Please wait before placing another bid.");
            }
            if (reason === "AUCTION_ENDED") {
                alert("Auction has ended.");
            }
        });

        socket.on("AUCTION_ENDED", ({ itemId }) => {
            if (itemId !== item.id) return;
            auctionEndedRef.current = true;
        });

        return () => {
            socket.off("UPDATE_BID");
            socket.off("BID_ERROR");
            socket.off("AUCTION_ENDED");
        };
    }, [item.id, userId]);

    const bid = () => {
        if (!isLive) return;

        const newBid = price + 10;
        setPrice(newBid);
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
            <div className="card-header">
                <h3 className="item-title">{item.title}</h3>

                <CountdownTimer
                    status={item.status}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    serverOffset={serverOffset}
                />
            </div>

            <div className={`price ${flash === "green" ? "flash-green" : ""} ${flash === "red" ? "flash-red" : ""}`}>
                ${price}
            </div>

            <button
                className="bid-btn"
                onClick={bid}
                disabled={
                    auctionEnded ||
                    !isLive ||
                    item.highestBidder === userId
                }
            >
                {auctionEnded
                    ? "Auction Ended"
                    : item.status === "UPCOMING"
                        ? "Auction Not Started"
                        : item.highestBidder === userId
                            ? "You are Highest Bidder"
                            : "Place Bid +$10"}
            </button>

            <div className="status">
                {status === "winning" && <span className="win">🏆 Winning</span>}
                {status === "outbid" && <span className="lose">❌ Outbid</span>}
            </div>
        </div>
    );
}