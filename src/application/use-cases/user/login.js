const bcrypt = require('bcryptjs');
const userRepo     = require('../../../infrastructure/db/userRepo');
const tokenService = require('../../../infrastructure/token/tokenService');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw err('Credenciales invalidas', 401);
  if (!user.isEmailVerified) throw err('Verifica tu email antes de entrar', 403);

  return { token: tokenService.sign(user.id) };
};
