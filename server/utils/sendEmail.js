import { createTransport } from "nodemailer";
import { ENV } from "../config/index.js";

const sendEmail = (to, subject, body) => {
    const transporter = createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: ENV.MAIL_EMAIL,
            pass: ENV.MAIL_PASS,
        },
    });
    const mailOptions = {
        from: ENV.MAIL_EMAIL,
        to,
        subject,
        html: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
};

export default sendEmail;
