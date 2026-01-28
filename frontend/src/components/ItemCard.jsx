import { useEffect, useState } from "react";
import { socket } from "../hooks/useSocket";
import CountdownTimer from "./CountdownTimer";

export default function ItemCard({ item, userId, serverOffset }) {
    const [price, setPrice] = useState(item.currentBid);
    const [status, setStatus] = useState("idle");
    const [auctionEnded, setAuctionEnded] = useState(false);

    useEffect(() => {
        socket.on("UPDATE_BID", updated => {
            if (updated.id !== item.id) {
                return;
            }
            setPrice(updated.currentBid);
            if (updated.highestBidder === userId) {
                setStatus("winning");
            }
            else {
                setStatus("outbid");
            }
            setTimeout(() => setStatus(""), 600);
        });

        socket.on("BID_ERROR", err => {
            setStatus("outbid");
        });

        socket.on("AUCTION_ENDED", ({ itemId }) => {
            if (itemId === item.id) {
                setAuctionEnded(true);
            }
        })
        return () => {
            socket.off("UPDATE_BID");
            socket.off("BID_ERROR");
            socket.off("AUCTION_ENDED");
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
        <div className={`card ${status}`}>
            <h3>{item.title}</h3>
            <h2>${price}</h2>
            <CountdownTimer
                endTime={Number(item.endTime)}
                serverOffset={serverOffset}
            />
            <button onClick={bid} disabled={auctionEnded}>
                {auctionEnded ? "Auction Ended" : "Bid +$10"}
            </button>
            {status === "winning" && <span>🏆 Winning</span>}
            {status === "outbid" && <span>❌ Outbid</span>}
        </div>
    );
}