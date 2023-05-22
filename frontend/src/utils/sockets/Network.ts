import { io } from "socket.io-client";

class Network {
  socket: any = undefined;
  init(serverUrl: string, name: any, id: number) {
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      //   updateSelfId(this.socket.id);

      //   this.socket.on("stateUpdate", handleStateUpdate);

      this.socket.emit("initialize", { name: name, gameId: id });
    });
  }
}

const network = new Network();

export default network;
