<<<<<<< HEAD
import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
=======
import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
>>>>>>> origin/master
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"FindIt API" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  };

  const info = await transporter.sendMail(mailOptions);
<<<<<<< HEAD

  console.log("Email sent:", info.response);
};

export default sendEmail;
=======
  console.log('Email sent:', info.response);
};

export default sendEmail;
>>>>>>> origin/master
