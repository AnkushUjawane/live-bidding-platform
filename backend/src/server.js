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
server.listen(9000, () => {
  console.log("Backend running on http://localhost:9000");
});