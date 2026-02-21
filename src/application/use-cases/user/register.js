const bcrypt = require('bcryptjs');
const { User } = require('../../../domain/User');
const { appUrl }   = require('../../../config');
const userRepo     = require('../../../infrastructure/db/userRepo');
const emailService = require('../../../infrastructure/email/emailService');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function register({ firstName, lastName, dni, phone, address, cardNumber, email, password }) {
  if (await userRepo.findByEmail(email)) throw err(`El usuario '${email}' ya existe`, 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = User.create({ firstName, lastName, dni, phone, address, cardNumber, email, passwordHash });

  await userRepo.create(user);
  const url = `${appUrl}/api/user/verify-email?token=${user.emailVerificationToken}`;
  await emailService.send(user.email, 'verifyEmail', { url });

  return { id: user.id, email: user.email };
};
