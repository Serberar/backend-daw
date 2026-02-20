
require('dotenv').config();

if (!process.env.JWT_ACCESS_SECRET) throw new Error('Falta JWT_ACCESS_SECRET en .env');

module.exports = {
  port:         Number(process.env.PORT) || 3000,
  appUrl:       process.env.APP_URL || 'http://localhost:3000',
  jwtSecret:    process.env.JWT_ACCESS_SECRET,
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },
};
