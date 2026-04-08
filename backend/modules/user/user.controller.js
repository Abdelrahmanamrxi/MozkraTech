import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import bcrypt from "bcrypt";
import { eventEmitter } from "../../utils/sendEmail.events/sendEmail.events.js";
import { generateToken } from "../../token/gnerateToken.js";
import jwt from "jsonwebtoken";
import HttpException from "../../utils/HttpException.js";
import {OAuth2Client} from 'google-auth-library';



//----------------------------------signUp-------------------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
    const { fullName, email, location, password, gender, confirmPassword, birthDate } = req.body;

    if (password !== confirmPassword) {
        return next(new HttpException("Password Doesn't Match",404));
    }
    
    // check email 
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
        return next(new HttpException("Email Already Exists",404));
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);

    // create user
    const user = await userModel.create({
        fullName,
        email,
        location,
        password: hashedPassword,
        gender,
        birthDate,
        provider:'system'
    });
    
    // send email after response path so this request is not blocked
    setImmediate(() => {
        eventEmitter.emit("sendEmail", { email });
    });
    return res.status(201).json({ message: "Sign up Successful", user });
});


// ----------------------------------confirmEmail-------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;
    const user = await userModel.findOne({email});

    if(!user || user.isVerified) {
        return next(new HttpException("email not exist or already verified"));
    }

    if (!user.OTPEmail || !user.OTPEmailExpiresAt || user.OTPEmailExpiresAt < new Date()) {
        return next(new HttpException("OTP has expired or is invalid",400));
    }

    //compare code 
    const isCodeValid = await bcrypt.compare(code, user.OTPEmail);
    if(!isCodeValid) {
        return next(new HttpException("Code Is Invalid"),400);
    }

    //update user
    await userModel.updateOne({email}, {isVerified: true, $unset: {OTPEmail: 0, OTPEmailExpiresAt: 0}});
    return res.status(200).json({message: "email verified"}); 
})


// ----------------------------------login-------------------------------------------
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({email, isVerified: true, isDeleted: false, provider: "system"});
    if(!user) {
        return next(new HttpException("User Doesn't Exist or not verified yet or logged in with google",401));
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
        return next(new HttpException("Token not Found"),400);
     
    }
    let SIGNATURE_TOKEN = undefined;
    if (prefix == "admin") {
        SIGNATURE_TOKEN= process.env.SECRET_KEY_ADMIN;
    }else if (prefix == "user") {
        SIGNATURE_TOKEN= process.env.SECRET_KEY_USER;
    }
    else {
        return next(new HttpException("Invalid Authorization Token",401));
        // return res.status(401).json({message: "token not found"});
    }
    const decoded = jwt.verify(token, SIGNATURE_TOKEN);
    console.log(decoded);

        if (!decoded?.id) {
            return next(new HttpException("Invalid Token Payload",401));
            // return res.status(401).json({message: "token invalid payload"});
    }
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new HttpException("User Not Found",404));
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
    const user = await userModel.findOne({ email, isDeleted: false, isVerified: true, provider: "system" });
    if (!user) {
        return next(new HttpException("Email Doesn't exist or not verified or logged in with google",400));
    }
    setImmediate(() => {
        eventEmitter.emit("forgetPassword", { email });
    });
    return res.status(200).json({ message: "email OTP sent" });
});


// ----------------------------------reset password-------------------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, newPassword, confirmPassword } = req.body;
    const user = await userModel.findOne({ email, isDeleted: false });
    if (!user) {
        return next(new HttpException("User Doesn't exist",400));
    }
    if (!user.OTPPassword || !user.OTPPasswordExpiresAt || user.OTPPasswordExpiresAt < new Date()) {
        return next(new HttpException("OTP has expired or is invalid"),400);
    }

    // compare code
    const isCodeValid = await bcrypt.compare(code, user.OTPPassword);    
    if (!isCodeValid) {
        return next(new HttpException("Code Is Invalid"),400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);

    // update password
    user.password = hashedPassword;
    user.isVerified = true;
    await user.save();
    await userModel.updateOne({email}, { $unset: {OTPPassword: 0, OTPPasswordExpiresAt: 0}});
    return res.status(200).json({ message: "password reset success" });
}); 

// ----------------------------------signUpWithGoogle-------------------------------------------
export const signUpWithGoogle = asyncHandler(async (req, res, next) => {
const { idToken, birthDate, location } = req.body;
const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  
    });
        const payload = ticket.getPayload();
        return payload;
}
    const { name, email, email_verified, picture } = await verify();

     // check email 
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
        return next(new HttpException("Email Already Exists", 404));
    }
        const user = await userModel.create({
            fullName:name,
            email: email,
            isVerified: email_verified,
            provider: 'google',
            birthDate,
            location
        })
    return res.status(200).json({message: "login with google success", user});
})


// ----------------------------------loginWithGoogle-------------------------------------------
export const loginWithGoogle = asyncHandler(async (req, res, next) => {

const client = new OAuth2Client();
    async function verify() {
        const { idToken} = req.body;
        const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  
    });
        const payload = ticket.getPayload();
        return payload;
}
    const {email} = await verify();
    
    let user = await userModel.findOne({email});
    if (!user) {
        return next(new HttpException("email not exist Please sign up"),400);
    }
    if (user.provider != 'google') {
        return next(new Error("login with google failed login with system "));
    }
    const accessToken = await generateToken({
        payload: {
            email,
            id: user._id},
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
    return res.status(200).json({message: "login with google success", accessToken, refreshToken});
})


{/** RE SEND OTP */}
export const resendOTP=asyncHandler(async(req,res,next)=>{
    const{email}=req.body

    const checkEmailExist=await userModel.findOne({email})

    if(!checkEmailExist) 
    return next(new HttpException("Email Doesn't Exist",404))

    eventEmitter.emit('sendEmail',{email})

    return res.status(200).json({message:'OTP Sent Succesfully'})

})