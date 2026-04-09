import  jwt  from 'jsonwebtoken';
import userModel from '../DB/models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler/index.js';



export const authentication = asyncHandler(
    async (req, res, next) => {

        const { authorization } = req.headers;
    const [prefix, token] = authorization.split(" ") || [];
    console.log(prefix);
    console.log(token);

        if (!prefix || !token) {
        return next(new HttpException("token not found",404))
    }
    let SIGNATURE_TOKEN = undefined;
    if (prefix == "admin") {
        SIGNATURE_TOKEN= process.env.SECRET_KEY_ADMIN;
    }else if (prefix == "user") {
        SIGNATURE_TOKEN= process.env.SECRET_KEY_USER;
    }
    else {
        return next(new HttpException("Invalid authorization token prefix",401))

        // return res.status(401).json({message: "token not found"});
     }
     const decoded = jwt.verify(token, SIGNATURE_TOKEN);
     console.log(decoded);

        if (!decoded?.id) {
            return next(new HttpException("token invalid payload", 404))

            // return res.status(401).json({message: "token invalid payload"});
    }
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new HttpException("user not found",404))

            // return res.status(401).json({message: "user not found"});
        }
        
        if (user?.passwordChangeAt && parseInt(user.passwordChangeAt.getTime() / 1000) > decoded.iat) {
        return next(new HttpException("password changed after token issued", 401));
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
            return next(new HttpException("unauthorized",401))
    }
    next();
})
}