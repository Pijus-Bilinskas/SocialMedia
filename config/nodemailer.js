import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "./env.js";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    }
});

const sendEmail = async (to, subject, html) => {
    try{
        const mailOptions = {
            from: `"Social Media" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.error("Error sending email", error)
    }
}
export default sendEmail;