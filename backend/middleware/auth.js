import  jwt  from 'jsonwebtoken';
import userModel from '../DB/models/user.model.js';
import { asyncHandler } from '../utils/globalErrorHandling/index.js';



export const authentication = asyncHandler(
    async (req, res, next) => {

        const { authorization } = req.headers;
    const [prefix, token] = authorization.split(" ") || [];
    console.log(prefix);
    console.log(token);

        if (!prefix || !token) {
        return next(new Error("token not found"));
        return res.status(401).json({message: "token not found"});
    }
    let SIGNATURE_TOKEN = undefined;
    if (prefix == "admin") {
        SIGNATURE_TOKEN= process.env.SECRET_KEY_ADMIN;
    }else if (prefix == "user") {
        SIGNATURE_TOKEN= process.env.SECRET_KEY_USER;
    }
    else {
        return next(new Error("Invalid authorization token prefix"));
        // return res.status(401).json({message: "token not found"});
     }
     const decoded = jwt.verify(token, SIGNATURE_TOKEN);
     console.log(decoded);

        if (!decoded?.id) {
            return next(new Error("token invalid payload"));
            // return res.status(401).json({message: "token invalid payload"});
    }
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new Error("user not found"));
            // return res.status(401).json({message: "user not found"});
        }
        
        if(parseInt(user?.passwordChangeAt.getTime() / 1000) > decoded.iat) {
            return next(new Error("password changed after token issued"));
            // return res.status(401).json({message: "password changed after token issued"});
        }
        req.user = user;
        next();

        
 /*        if(error?.name === "JsonWebTokenError" ) {
            return res.status(401).json({message: "token invalid"});
    }   
    if(error?.name === "TokenExpiredError" ) {
            return res.status(401).json({message: "token expired"});
    }
        return res.status(500).json({message: "server error", message: error.message, stack:error.stack, error}); */
})


export const authorization = (accessRole = []) => {
    return asyncHandler(async (req, res, next) => {

        
        if (!accessRole.includes(req.user.role)) {
            return next(new Error("unauthorized"));
            // return res.status(401).json({message: "unauthorized"});
    }
    next();
})
}