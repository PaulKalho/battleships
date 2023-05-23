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

/**  Send to the sender and none else

// socket.emit('hello', msg);

// Send to everyone including the sender(if the sender is in the room) in the room "my room"

// io.to('my room').emit('hello', msg);

// Send to everyone except the sender(if the sender is in the room) in the room "my room"

// socket.broadcast.to('my room').emit('hello', msg);

// Send to everyone in every room, including the sender

// io.emit('hello', msg); // short version

// io.sockets.emit('hello', msg);

// Send to specific socket only (private chat)

// socket.broadcast.to(otherSocket.id).emit('hello', msg); */

io.on("connection", (socket) => {
  socket.on("join_game", ({ gameId }: Init) => {
    console.log(socket.id + " joined the game " + gameId);
    gameId = gameId.toString();
    socket.join(gameId.toString());
    gameIdGlobal = gameId;

    if (io.sockets.adapter.rooms.get(gameId.toString())?.size === 2) {
      socket.broadcast.to(gameId.toString()).emit("start-game");
    }
  });

  // bomb -> emit from client, when a field was selected
  socket.on("bomb", ({ x, y }: Field) => {
    //  if a shit was hit, send the info back to the "sender"
    // TODO: Send info about ship
    socket.emit("was-a-hit", { colNum: x, rowNum: y });

    // was-bombed -> emit from Server, tells Client which field was bombed
    socket.broadcast
      .to(gameIdGlobal)
      .emit("was-bombed", { colNum: x, rowNum: y });
  });
});

server.listen(3001, () => {
  console.log("Server listening");
});
