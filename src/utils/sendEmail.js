const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
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
  console.log('Email sent:', info.response);
};

module.exports = sendEmail;
