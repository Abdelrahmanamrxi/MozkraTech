
import nodemailer from 'nodemailer';




export const sendEmail = async (to, sub, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
        const info = await transporter.sendMail({
            from: `MozakraTech" <${process.env.EMAIL}>`,
            to: to? to : "mohamedislamdado100@gmail.com",
            subject: sub? sub : "Hello",
 /*            text: "Hello world?", */
            html: html? html : "<b>Hello world?</b>",
        });

    // console.log("Message sent:", info);
    if (info.accepted.length) {
        return true;
    } else {
        return false;
    }
}
