import  jwt  from 'jsonwebtoken';
import userModel from '../DB/models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler/index.js';
import HttpException from '../utils/HttpException.js';



export const authentication = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpException("Access Denied", 401));
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new HttpException("Authorization Failed", 401));
  }

  if (!decoded?.id) {
    return next(new HttpException("Access Denied", 401));
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return next(new HttpException("User Not Found", 404));
  }

  if (
    user.passwordChangeAt &&
    user.passwordChangeAt.getTime() / 1000 > decoded.iat
  ) {
    return next(
      new HttpException("Password changed, please login again", 401)
    );
  }

  // attach user + role
  req.user = user;
  req.role = decoded.role;

  next();
});


export const authorization = (accessRole = []) => {
    return asyncHandler(async (req, res, next) => {

        
        if (!accessRole.includes(req.user.role)) {
            return next(new HttpException("Unauthorized Role Undefined",401))
    }
    next();
})
}


export const authSocket = async ({ socket }) => {
    try {
        const authHeader = socket?.handshake?.auth?.authorization;

        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { message: "token not found or invalid format", statusCode: 401 };
        }

        const token = authHeader.split(" ")[1];

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded?.id) {
            return { message: "token invalid payload", statusCode: 401 };
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return { message: "user not found", statusCode: 404 };
        }

      
        if (
            user?.passwordChangeAt && 
            user.passwordChangeAt.getTime() / 1000 > decoded.iat
        ) {
            return { message: "Password changed, please login again", statusCode: 401 };
        }

      
        return { user, role: decoded.role, statusCode: 200 };

    } catch (err) {
        console.log("JWT Error:", err.message);
        return { message: "Authorization Failed", statusCode: 401 };
    }
}