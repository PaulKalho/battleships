import { Anybody } from "next/font/google";
import { io } from "socket.io-client";

const network = io("http://localhost:3001");

export default network;
