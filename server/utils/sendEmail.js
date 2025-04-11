const nodemailer = require('nodemailer');

const sendEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"HealthyFood" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Активация аккаунта',
    html: `
      <div>
        <h1>Для активации аккаунта перейдите по ссылке:</h1>
        <a href="${link}">${link}</a>
      </div>
    `,
  });
};

module.exports = sendEmail;
