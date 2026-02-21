const nodemailer = require('nodemailer');
const { smtp } = require('../../config');

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: { user: smtp.user, pass: smtp.pass },
});

module.exports = {
  send: async (to, templateName, data) => {
    const template = require(`./templates/${templateName}`);
    const { subject, html } = template(data);
    await transporter.sendMail({ from: smtp.from, to, subject, html });
  },
};
