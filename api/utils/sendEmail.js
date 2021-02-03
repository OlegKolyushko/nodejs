const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.NODEMAILER_EMAIL,
  to: "oleg.kolyushko@gmail.com",
  subject: "Email verification",
  html: 'verify',
};

async function main(params) {
    const result = await transporter.sendMail(mailOptions);
    return result;
}

module.exports = main();
