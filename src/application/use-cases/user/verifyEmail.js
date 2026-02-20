const userRepo = require('../../../infrastructure/db/userRepo');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function verifyEmail({ token }) {
  const user = await userRepo.findByVerificationToken(token);
  if (!user || user.isVerificationTokenExpired()) throw err('Token de verificacion invalido o expirado', 400);

  user.verifyEmail();
  await userRepo.update(user);

  return { message: 'Email verificado correctamente' };
};
