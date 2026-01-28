import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_API_URL;

if (!BACKEND_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
});