
const { db }   = require('./client');
const { User } = require('../../domain/User');

const toUser = (r) => new User(r);

module.exports = {
  findById:                (id)    => db.user.findUnique({ where: { id } }).then(r => r ? toUser(r) : null),
  findByEmail:             (email) => db.user.findUnique({ where: { email: email.toLowerCase().trim() } }).then(r => r ? toUser(r) : null),
  findByVerificationToken: (token) => db.user.findUnique({ where: { emailVerificationToken: token } }).then(r => r ? toUser(r) : null),

  create: (user) => db.user.create({
    data: {
      id: user.id,
      firstName: user.firstName, lastName: user.lastName, dni: user.dni,
      phone: user.phone, address: user.address, cardNumber: user.cardNumber,
      email: user.email, passwordHash: user.passwordHash,
      isEmailVerified: user.isEmailVerified,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationTokenExpiresAt: user.emailVerificationTokenExpiresAt,
    },
  }),

  update: (user) => db.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: user.isEmailVerified,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationTokenExpiresAt: user.emailVerificationTokenExpiresAt,
      updatedAt: user.updatedAt,
    },
  }),

  updateProfile: (user) => db.user.update({
    where: { id: user.id },
    data: {
      firstName: user.firstName, lastName: user.lastName,
      phone: user.phone, address: user.address,
      updatedAt: user.updatedAt,
    },
  }),
};
