declare var require: any;

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

type Field = {
  x: number | null;
  y: number | null;
};

io.on("connection", (socket) => {
  socket.on("bomb-field", ({ x, y }: Field) => {
    socket.broadcast.emit("bomb-field", { x });
  });
});
