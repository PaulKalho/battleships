import { Anybody } from "next/font/google";
import { io } from "socket.io-client";

const network = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://todo-backend.kalhorn.io"
);

export default network;
