const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Init = {
  name: string;
  gameId: number;
};

io.on("connection", (socket) => {
  socket.on("initialize", ({ name, gameId }: Init) => {
    socket.join(gameId.toString());

    if (io.sockets.adapter.rooms.get(gameId.toString())?.size === 2) {
      console.log("START");
      socket.emit("start-game");
    }
  });
});

server.listen(3001, () => {
  console.log("Server listening");
});
