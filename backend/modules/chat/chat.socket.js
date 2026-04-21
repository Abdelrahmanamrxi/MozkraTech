import { Server } from "socket.io";
import { logOut, registerAccount } from "./chat.socket.service.js";
import { markAsRead, sendMessage } from "./message.service.js";


export const runIo = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.FRONTEND_URL,"http://localhost:5174"],
      methods:['GET','POST','PATCH','PUT','DELETE'],
      credentials:true
    },
  });

  io.on("connection", async (socket) => {
    // console.log(socket.id);
    // console.log(socket.handshake.auth);
    
    await registerAccount(socket);
    await sendMessage(socket);
    await markAsRead(socket);
    await logOut(socket);
  });
};
