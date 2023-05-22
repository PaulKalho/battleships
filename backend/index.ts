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
  gameId: string;
};

type Field = {
  x: number;
  y: number;
};

var gameIdGlobal: string;

io.on("connection", (socket) => {
  socket.on("join_game", ({ gameId }: Init) => {
    console.log(socket.id + " joined the game " + gameId);
    gameId = gameId.toString();
    socket.join(gameId.toString());
    gameIdGlobal = gameId;

    if (io.sockets.adapter.rooms.get(gameId.toString())?.size === 2) {
      console.log(gameIdGlobal);
      socket.to(gameId.toString()).emit("start-game");
    }
  });
  socket.on("bomb", ({ x, y }: Field) => {
    socket.to(gameIdGlobal).emit("was-bombed", { colNum: x, rowNum: y });
  });
});

server.listen(3001, () => {
  console.log("Server listening");
});
