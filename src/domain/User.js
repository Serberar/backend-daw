
const crypto = require('crypto');

class User {
  constructor({ id, firstName, lastName, dni, phone, address, cardNumber, email, passwordHash,
    isEmailVerified = false, emailVerificationToken = null,
    emailVerificationTokenExpiresAt = null, createdAt = new Date(), updatedAt = new Date() }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.cardNumber = cardNumber;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isEmailVerified = isEmailVerified;
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ firstName, lastName, dni, phone, address, cardNumber, email, passwordHash }) {
    return new User({
      id:                              crypto.randomUUID(),
      firstName, lastName, dni, phone, address, cardNumber,
      email:                           email.toLowerCase().trim(),
      passwordHash,
      emailVerificationToken:          crypto.randomBytes(32).toString('hex'),
      emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  verifyEmail() {
    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    this.emailVerificationTokenExpiresAt = null;
    this.updatedAt = new Date();
  }

  isVerificationTokenExpired() {
    return !this.emailVerificationTokenExpiresAt || new Date() > this.emailVerificationTokenExpiresAt;
  }

  updateProfile({ firstName, lastName, phone, address }) {
    if (firstName) this.firstName = firstName;
    if (lastName)  this.lastName  = lastName;
    if (phone)     this.phone     = phone;
    if (address)   this.address   = address;
    this.updatedAt = new Date();
  }
}

module.exports = { User };
