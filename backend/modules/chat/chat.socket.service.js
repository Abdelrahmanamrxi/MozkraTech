import { authSocket } from "../../middleware/auth.js";


export const connectioUser = new Map();


export const registerAccount = async (socket) => {
    
    const data = await authSocket({ socket });
    if (data.statusCode != 200) {
        return socket.emit("authError", data);
    }
    console.log(connectioUser);
    connectioUser.set(data.user._id.toString(), socket.id);
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
    console.log(connectioUser);
    return "done";
    })
};