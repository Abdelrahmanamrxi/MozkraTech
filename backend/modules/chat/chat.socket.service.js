import { authSocket } from "../../middleware/auth.js";
import userModel from "../../DB/models/user.model.js";

export const connectioUser = new Map();

export const userStatus = new Map();

export const setUserOnline = (userId) => {
  userStatus.set(userId.toString(), {
    status: "online",
    lastActivityDate: Date.now(),
  });
};

export const setUserOffline = (userId) => {
  userStatus.set(userId.toString(), {
    status: "offline",
    lastActivityDAte: userStatus.get(userId.toString())?.lastActive || Date.now(),
  });
};


export const saveUserStatusToDB = async (userId) => {
  const status = userStatus.get(userId.toString());
  if (status) {
    await userModel.findByIdAndUpdate(userId, {
      lastActivityDate: status.lastActivityDate,
    });
  }
};




export const registerAccount = async (socket) => {
    
    const data = await authSocket({ socket });
    if (data.statusCode != 200) {
        return socket.emit("authError", data);
    }
    console.log(connectioUser);
    connectioUser.set(data.user._id.toString(), socket.id);
    setUserOnline(data.user._id.toString())
    console.log(connectioUser);
    return "done";
};

export const logOut= async (socket) => {
    
    const data = await authSocket({ socket });
    return socket.on("disconnect", async () => {
        const data = await authSocket({ socket });
    if (data.statusCode != 200) {
        return socket.emit("authError", data);
    }
    connectioUser.delete(data.user._id.toString(), socket.id);
    setUserOffline(data.user._id.toString())
    await saveUserStatusToDB(data.user._id.toString())
    console.log(connectioUser);
    return "done";
    })
};