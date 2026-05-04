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
    lastActivityDate: userStatus.get(userId.toString())?.lastActivityDate || Date.now(),
  });
};


export const saveUserStatusToDB = async (userId) => {
  console.log(userId)
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
    connectioUser.set(data.user._id.toString(), socket.id);
    setUserOnline(data.user._id.toString())
    console.log(userStatus);
    return "done";
};

export const logOut= async (socket) => {

    return socket.on("disconnect", async () => {
  const data = await authSocket({ socket });
    if (data.statusCode != 200) {
    return;
    }

  const userId = data.user._id.toString();
  const activeSocketId = connectioUser.get(userId);

  // If this is not the currently tracked socket, a newer connection is active.
  if (activeSocketId !== socket.id) {
    return;
  }

  connectioUser.delete(userId);
  setUserOffline(userId)
  await saveUserStatusToDB(userId)
    console.log(connectioUser);
    return "done";
    })
};