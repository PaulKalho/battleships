import { io } from "socket.io-client";

const network = io(
  process.env.NODE_ENV === "development"
    ? "http://battleships-backend:3001"
    : "https://backend-battleships.kalhorn.io",
  { secure: true }
);

export default network;
