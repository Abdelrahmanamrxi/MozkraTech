import { Server } from "socket.io";
import { logOut, registerAccount } from "./chat.socket.service.js";
import { sendMessage } from "./message.service.js";

export const runIo = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    // console.log(socket.id);
    // console.log(socket.handshake.auth);
    await registerAccount(socket);
    await sendMessage(socket);
    await logOut(socket);
  });
};
