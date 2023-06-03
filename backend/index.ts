const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const app = express();

var privateKey = fs.readFileSync("certs/kalhorn.io_private_key.key");
var certificate = fs.readFileSync("certs/kalhorn.io_ssl_certificate.cer");

var credentials = {
  key: privateKey,
  cert: certificate,
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

import { Server } from "socket.io";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

type Init = {
  gameId: string;
  boardData: any;
  shipPositions: any;
};

type Field = {
  x: number;
  y: number;
};

type OpponentPlayerInfo = {
  board: any;
  shipPostitions: any;
};

var gameIdGlobal: string;

function getOpponentPlayerInfo(
  socket: any,
  participants: any
): OpponentPlayerInfo {
  /**
   * Gets the PlayerBoard of the opponent
   * @param socket = the connected socket
   * @param participants = all sockets in the room
   *
   * @return the opponent playerBoard
   */
  const socketOfEmitter = socket;
  var opponentPlayerInfo: OpponentPlayerInfo = {
    board: undefined,
    shipPostitions: undefined,
  };
  var opponentPlayerBoard: any = undefined;

  for (const participantId of participants) {
    const clientSocket = io.sockets.sockets.get(participantId);
    // console.log("Emitter: " + socketOfEmitter?.data.gameBoard);
    // console.log("Client: " + clientSocket?.data.gameBoard);
    if (socketOfEmitter !== clientSocket) {
      opponentPlayerInfo = {
        board: clientSocket?.data.gameBoard,
        shipPostitions: clientSocket?.data.shipPositions,
      };
    }
  }

  return opponentPlayerInfo;
}

function isHit(x: number, y: number, board: any): boolean {
  /**
   * Function checks if a bomb is a hit
   * @param x = x-coord
   * @param y = y coord
   * @param board = the board to check
   *
   * @return bool
   */

  if (board[y][x].isShip) {
    board[y][x].isBombed = true;
    return true;
  } else {
    return false;
  }
}

function shipDestroyed(
  x: number,
  y: number,
  board: any,
  shipPositions: any
): boolean {
  /**
   * Checks if the bomb, did destroy a ship (all fields of the ship bombed)
   * We already checked if the bomb was a hit, so we dont have to do it here anymore
   * @param x = x-coord
   * @param y = y-coord
   * @param board = the board to check
   * @param shipPositions = the shipPositionsArray (all positions of each ship)
   *
   * @return bool
   */

  const allPos = shipPositions[board[y][x].shipIndex];

  return allPos.every((pos: any) => board[pos.y][pos.x].isBombed === true);
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
  socket.on("join_game", ({ gameId, boardData, shipPositions }: Init) => {
    /** Player joins game and sends the board */
    // Set the Data
    gameIdGlobal = gameId;
    socket.data.gameBoard = boardData;
    socket.data.shipPositions = shipPositions;

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

    const opponentPlayerInfo = getOpponentPlayerInfo(
      socket,
      io.sockets.adapter.rooms.get(gameIdGlobal)
    );

    if (isHit(x, y, opponentPlayerInfo.board)) {
      /** Bomb placed hit a ship */
      if (
        shipDestroyed(
          x,
          y,
          opponentPlayerInfo.board,
          opponentPlayerInfo.shipPostitions
        )
      ) {
        //Ship was destroyed -> to the bomber
        socket.emit("ship-destroyed", {
          shipLength:
            opponentPlayerInfo.shipPostitions[
              opponentPlayerInfo.board[y][x].shipIndex
            ].length,
        });
      }
      socket.emit("was-a-hit", { colNum: x, rowNum: y });
    }

    /** Send to the other client which field was bombed */
    socket.broadcast
      .to(gameIdGlobal)
      .emit("was-bombed", { colNum: x, rowNum: y });
  });
});

httpServer.listen(3001, () => {
  console.log("Server listening");
});
