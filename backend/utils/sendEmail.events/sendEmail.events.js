import { EventEmitter } from "events";
import { nanoid, customAlphabet } from "nanoid";
import userModel from "../../DB/models/user.model.js";
import { html } from "../../services/template-email.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../services/sendEmail.js";




export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
    const { email } = data;
    //generate opt
    const otp = customAlphabet("1234567890", 4)();

    //hashing otp
    const hashedOtp = await bcrypt.hashSync(otp, +process.env.SALT_ROUNDS);

    //update otp
    await userModel.updateOne({email}, {OTPEmail: hashedOtp});
    
    await sendEmail(email, "confirm Email", html({code: otp, message: "Email Confirmation"}));

        
});


eventEmitter.on("forgetPassword", async (data) => {
    const { email } = data;
    //generate opt
    const otp = customAlphabet("1234567890", 4)();

    //hashing otp
    const hashedOtp = await bcrypt.hashSync(otp, +process.env.SALT_ROUNDS);

    //update otp
    await userModel.updateOne({email}, {OTPPassword: hashedOtp});
    
    await sendEmail(email, "forget password", html({code: otp, message: "forget password"}));
});


