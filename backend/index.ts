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
  boardData: any;
};

type Field = {
  x: number;
  y: number;
};

var gameIdGlobal: string;

function getOpponentPlayerBoard(socket: any, participants: any): any {
  /**
   * Gets the PlayerBoard of the opponent
   * @param socket = the connected socket
   * @param participants = all sockets in the room
   *
   * @return the opponent playerBoard
   */
  const socketOfEmitter = socket;
  var opponentPlayerBoard: any = undefined;

  for (const participantId of participants) {
    const clientSocket = io.sockets.sockets.get(participantId);
    // console.log("Emitter: " + socketOfEmitter?.data.gameBoard);
    // console.log("Client: " + clientSocket?.data.gameBoard);
    if (socketOfEmitter !== clientSocket) {
      opponentPlayerBoard = clientSocket?.data.gameBoard;
    }
  }

  return opponentPlayerBoard;
}

function isHit(x: any, y: any, board: any): boolean {
  /**
   * Function checks if a bomb is a hit
   * @param x = x-coord
   * @param y = y coord
   * @param board = the board to check
   *
   * @return bool
   */
  if (board[y][x].isShip) {
    return true;
  } else {
    return false;
  }
}

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
  socket.on("join_game", ({ gameId, boardData }: Init) => {
    /** Player joins game and sends the board */
    // Set the Data
    gameIdGlobal = gameId;
    socket.data.gameBoard = boardData;

    // Join Room
    socket.join(gameIdGlobal);
    console.log("Player joined");

    io.sockets.adapter.rooms.get(gameIdGlobal);

    if (io.sockets.adapter.rooms.get(gameId.toString())?.size === 2) {
      console.log("Start Game " + gameIdGlobal);
      /** Game starts when two players in the room */
      socket.broadcast.to(gameId.toString()).emit("start-game");
    }
  });

  socket.on("bomb", ({ x, y }: Field) => {
    /** A bomb was placed */

    const opponentPlayerBoard = getOpponentPlayerBoard(
      socket,
      io.sockets.adapter.rooms.get(gameIdGlobal)
    );

    if (isHit(x, y, opponentPlayerBoard)) {
      /** Bomb placed hit a ship */
      socket.emit("was-a-hit", { colNum: x, rowNum: y });
    }

    /** Send to the other client which field was bombed */
    socket.broadcast
      .to(gameIdGlobal)
      .emit("was-bombed", { colNum: x, rowNum: y });
  });
});

server.listen(3001, () => {
  console.log("Server listening");
});
