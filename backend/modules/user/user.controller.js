import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling/index.js";
import bcrypt from "bcrypt";
import { eventEmitter } from "../../utils/sendEmail.events/sendEmail.events.js";
import { generateToken } from "../../token/gnerateToken.js";
import jwt from "jsonwebtoken";



//----------------------------------signUp-------------------------------------------

export const signUp = asyncHandler(async (req, res, next) => {
    const { fullName, email, location, password, gender, confirmPassword, birthDate } = req.body;

    if (password !== confirmPassword) {
        return next(new Error("password and confirm password do not match"));
    }
    
    // check email 
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
        return next(new Error("email already exist"));
    }

    // hashing password
    const hashedPassword = await bcrypt.hashSync(password, +process.env.SALT_ROUNDS);


    // create user
    const user = await userModel.create({
        fullName,
        email,
        location,
        password: hashedPassword,
        gender,
        birthDate
    });

    
    // send email
    eventEmitter.emit("sendEmail", { email });

    return res.status(201).json({ message: "Sign up success", user });
});


// ----------------------------------confirmEmail-------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;
    const user = await userModel.findOne({email});

    if(!user || user.isVerified) {
        return next(new Error("email not exist or already verified"));
    }

    //compare code 
    const isCodeValid = await bcrypt.compareSync(code, user.OTPEmail);
    if(!isCodeValid) {
        return next(new Error("code is invalid"));
    }

    //update user
    await userModel.updateOne({email}, {isVerified: true, $unset: {OTPEmail: 0}});
    return res.status(200).json({message: "email verified"}); 
})


// ----------------------------------login-------------------------------------------
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({email, isVerified: true});
    if(!user) {
        return next(new Error("user not exist or not verified yet"));
    }

    //compare password
    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if(!isPasswordValid) {
        return next(new Error("password is invalid"));
    }

    //generate token 
    const accessToken = await generateToken({
        payload: {
            email,
            id: user._id
        },
            SIGNATURE: user.role === "admin" ? process.env.SECRET_KEY_ADMIN : process.env.SECRET_KEY_USER,
            option: {expiresIn: "1d"}
        
    });
    const refreshToken = await generateToken({
        payload: {
            email,
            id: user._id
        },
            SIGNATURE: user.role === "admin" ? process.env.SECRET_KEY_ADMIN : process.env.SECRET_KEY_USER,
            option: {expiresIn: "2w"}
        
    });

    return res.status(200).json({
        message: "login success",
        token: {
            accessToken,
            refreshToken
    }});
})



// ----------------------------------refreshToken-------------------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
    const { authorization } = req.body;
    const [prefix, token] = authorization.split(" ")|| [];
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
    }
    
    //generate access token
    const accessToken = await generateToken({
        payload: {
            email: user.email,
            id: user._id
        },
            SIGNATURE: user.role === "admin" ? process.env.SECRET_KEY_ADMIN : process.env.SECRET_KEY_USER,
            option: {expiresIn: "1d"}
        
    });
    return res.status(200).json({message: "refresh token success", token: accessToken});
})


// ----------------------------------forget password-------------------------------------------

export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email, isDeleted: false });
    if (!user) {
        return next(new Error("user not exist"));
    }
    eventEmitter.emit("forgetPassword", { email });
    return res.status(200).json({ message: "email OTP sent" });
});


// ----------------------------------reset password-------------------------------------------

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, newPassword, confirmPassword } = req.body;
    const user = await userModel.findOne({ email, isDeleted: false });
    if (!user) {
        return next(new Error("user not exist"));
    }
    // compare code
    const isCodeValid = await bcrypt.compareSync(code, user.OTPPassword);    
    if (!isCodeValid) {
        return next(new Error("code is invalid"));
    }
    const hashedPassword = await bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

    // update password
    user.password = hashedPassword;
    user.isVerified = true;
    await user.save();
    await userModel.updateOne({email}, { $unset: {OTPPassword: 0}});
    return res.status(200).json({ message: "password reset success" });
}); 

    