import nodemailer from "nodemailer"
import config from "../config";

export const sendEmail = async(to: string, html: string) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com.",
        port: 587,
        secure: config.node_env === 'production',
        auth: {
          
          user: "moyuriakther97@gmail.com",
          pass: "zmnr qlfe vxcs isqx",
        },
      });
   await transporter.sendMail({
        from: 'moyuriakther97@gmail.com', // sender address
        to, // list of receivers
        subject: "Reset your password within 10 minutes", // Subject line
        text: "Reset your password within 10 minutes", // plain text body
        html, // html body
      });
}