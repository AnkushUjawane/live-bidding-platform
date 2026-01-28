const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const itemsRoute = require("./routes/items.routes");
const setupSocket = require("./socket");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/items", itemsRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

setupSocket(io);
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});