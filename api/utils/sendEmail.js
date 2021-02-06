const nodemailer = require("nodemailer");

async function sendEmail(recipient, verificationToken) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: "Email verification",
    html: `<a href='http://localhost:3000/api/auth/verify/${verificationToken}'>Click to verify</a>`,
  })
}

module.exports = sendEmail;
