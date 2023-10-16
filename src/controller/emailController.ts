// installed libraries
import nodemailer from "nodemailer";
// types
import { IData } from "../types";

const sendEmail: IData = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: "Hi from Gapi", // sender address
    to: data?.to, // list of receivers
    subject: data?.subject, // Subject line
    text: data?.text, // plain text body
    html: data?.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
