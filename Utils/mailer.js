import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.Mail_Host,
  port: Number(process.env.Mail_Port),
  secure: false,
  auth: {
    user: process.env.Mail_User,
    pass: process.env.Mail_pass,
  },
});

const SendEmail = async (to, subject, content) => {
  try {
    await transporter.sendMail({
      from: process.env.Mail_User,
      to: to,
      subject: subject,
      html: content,
    });
    console.log("email sent");
  } catch (error) {
    console.log("email error", error.message);
  }
};

export default SendEmail;
